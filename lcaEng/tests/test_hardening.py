from __future__ import annotations

from src.utils.hardening import safe_startup_engine, DummyEngine


def test_safe_startup_engine_returns_dummy_on_exception() -> None:
    def bad_init() -> object:
        raise RuntimeError("init failed for testing")

    engine = safe_startup_engine(bad_init, reason_msg="unit-test")
    assert isinstance(engine, DummyEngine)
    resp = engine.analyze_single_scenario()
    assert isinstance(resp, dict)
    assert resp.get("success") is False


def test_safe_startup_engine_returns_real_engine_on_success() -> None:
    class FakeEngine:
        pass

    def ok_init() -> FakeEngine:
        return FakeEngine()

    engine = safe_startup_engine(ok_init)
    assert isinstance(engine, FakeEngine)
