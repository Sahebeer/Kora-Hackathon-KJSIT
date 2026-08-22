"""Resiliency helpers for LCA workflows.

Provides common helpers to make long-running LCA workflows resilient:
- ``setup_logging``: configure structured logging
- ``retry_on_exception``: decorator to retry transient failures
- ``safe_main_wrapper``: run script mains with retries and controlled exit
- ``safe_startup_engine``: initialize engines with graceful fallback
- ``DummyEngine``: minimal fallback engine returning structured errors

Keep helpers conservative and importable from server and script entry
points so an engine failure does not crash the process.
"""
from __future__ import annotations

import functools
import logging
import time
import traceback
from typing import Callable, Any


class DummyEngine:
    """Fallback engine used when real engine initialization fails.

    Methods mimic a subset of the real engine's public API and return
    structured error objects instead of raising.
    """

    def __init__(self, reason: str = "Engine unavailable") -> None:
        self._reason = reason
        self.logger = logging.getLogger(__name__)

    def _error_response(self, context: str) -> dict:
        self.logger.warning(
            "DummyEngine used for %s: %s", context, self._reason
        )
        return {
            "success": False,
            "error": f"{context} failed: {self._reason}",
        }

    def analyze_single_scenario(self, *args, **kwargs) -> dict:
        return self._error_response("analyze_single_scenario")

    def batch_analysis(self, *args, **kwargs) -> dict:
        return self._error_response("batch_analysis")

    def compact_wizard_document(self, *args, **kwargs) -> dict:
        return self._error_response("compact_wizard_document")

    def compact_wizard_with_llm(self, *args, **kwargs) -> dict:
        return {
            "compact": {},
            "llm": {"success": False, "recommendations": []},
            "error": self._reason,
        }


def setup_logging(
    level: int = logging.INFO,
    log_file: str | None = None,
) -> None:
    """Configure basic logging for scripts.

    Adds a console handler and (optionally) a file handler. Safe to call
    multiple times; subsequent calls are idempotent.
    """
    root = logging.getLogger()
    if root.handlers:
        # Don't reconfigure if already done
        return
    root.setLevel(level)
    fmt = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    ch = logging.StreamHandler()
    ch.setFormatter(fmt)
    root.addHandler(ch)
    if log_file:
        try:
            from logging.handlers import RotatingFileHandler

            fh = RotatingFileHandler(
                log_file,
                maxBytes=10 * 1024 * 1024,
                backupCount=3,
            )
            fh.setFormatter(fmt)
            root.addHandler(fh)
        except Exception:
            root.warning("Failed to configure file logging for %s", log_file)


def retry_on_exception(
    exceptions: Any = (Exception,),
    max_attempts: int = 3,
    initial_delay: float = 1.0,
    backoff: float = 2.0,
) -> Callable:
    """Decorator to retry a function on exceptions.

    Example:
        @retry_on_exception(max_attempts=5)
        def call_remote():
            ...
    """

    if not isinstance(exceptions, tuple):
        exceptions = tuple(exceptions)  # type: ignore[arg-type]

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            attempt = 0
            delay = initial_delay
            while True:
                try:
                    return func(*args, **kwargs)
                except exceptions as exc:
                    attempt += 1
                    _logger = logging.getLogger(func.__module__)
                    func_name = getattr(func, "__name__", str(func))
                    _logger.exception(
                        "Attempt %d/%d failed for %s: %s",
                        attempt,
                        max_attempts,
                        func_name,
                        exc,
                    )
                    if attempt >= max_attempts:
                        raise
                    time.sleep(delay)
                    delay *= backoff

        return wrapper

    return decorator


def safe_main_wrapper(
    main_callable: Callable[[], int | None],
    *,
    max_attempts: int = 3,
    initial_delay: float = 1.0,
) -> int:
    """Run a script main function with retries and controlled exit code.

    - Retries on any exception up to `max_attempts` with exponential backoff.
    - Logs full traceback on failures.
    - Returns 0 on success or non-zero on persistent failure.
    """
    attempt = 0
    delay = initial_delay
    logger = logging.getLogger(main_callable.__module__)
    while True:
        try:
            res = main_callable()
            return 0 if res in (None, 0) else int(res)
        except Exception:
            attempt += 1
            tb = traceback.format_exc()
            logger.error(
                "Unhandled exception in main (attempt %d/%d):\n%s",
                attempt,
                max_attempts,
                tb,
            )
            if attempt >= max_attempts:
                logger.critical(
                    "Main failed after %d attempts, exiting with code 1",
                    attempt,
                )
                return 1
            logger.info("Retrying main in %.1fs...", delay)
            time.sleep(delay)
            delay *= 2


def safe_startup_engine(
    init_callable: Callable[[], Any],
    *,
    reason_msg: str = "Engine init failed",
) -> Any:
    """Attempt to initialize an engine; return a DummyEngine on failure.

    This is intended for long-lived servers where failing to initialize
    should not necessarily crash the process — instead provide a graceful
    fallback that returns structured error responses to API clients.
    """
    logger = logging.getLogger(init_callable.__module__)
    try:
        engine = init_callable()
        return engine
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Engine initialization failed: %s", exc)
        return DummyEngine(reason=f"{reason_msg}: {exc}")
