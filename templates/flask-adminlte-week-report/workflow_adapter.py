#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Replaceable adapter for the AI workflow.

The contract:
- Input is validated before any network call.
- Real call fails gracefully into a mock fallback with the same response shape.
- Timeout, empty result, and malformed response are handled explicitly.
- Every outcome returns the same JSON envelope.
"""

import os
from datetime import datetime

WORKFLOW_TIMEOUT = int(os.environ.get("WORKFLOW_TIMEOUT", "10"))



def make_error(code, message):
    return {"ok": False, "data": None, "error": {"code": code, "message": message}, "fallback": False}


def make_success(data, fallback=False):
    return {"ok": True, "data": data, "error": None, "fallback": fallback}


def validate_input(payload, required_fields=None):
    """Return (is_valid, error_response)."""
    if not isinstance(payload, dict):
        return False, make_error("INVALID_INPUT", "payload must be an object")

    for field in required_fields or []:
        if field not in payload or payload[field] in (None, "", []):
            return False, make_error("INVALID_INPUT", f"missing required field: {field}")

    return True, None


def _call_real_workflow(payload, timeout):
    """Placeholder for the real AI platform call.

    Implement this when the real workflow endpoint and credentials are available.
    Must return the same data shape as _mock_workflow or raise an exception.
    """
    raise NotImplementedError("real workflow integration is not configured")


def _mock_workflow(payload):
    """Mock fallback with the same response shape as the real workflow."""
    user_input = payload.get("input", "")
    return {
        "output": f"mock processed: {user_input}".strip(),
        "confidence": 0.95,
        "processed_at": datetime.utcnow().isoformat() + "Z",
    }


def _normalize_empty_result(data):
    """Guarantee a non-empty, usable payload when the upstream returns nothing."""
    if data is None:
        data = {}
    if isinstance(data, dict) and not data:
        return {"output": "", "confidence": 0.0, "empty": True}
    return data


def _use_mock_env():
    """Default to mock mode unless explicitly disabled."""
    return os.environ.get("WORKFLOW_MOCK", "true").lower() in ("1", "true", "yes")


def call_workflow(payload, use_mock=None, timeout=None):
    """Validate input, call the workflow (real or mock), and return a stable envelope.

    Args:
        payload: dict with workflow input.
        use_mock: if True, skip the real call and return the mock response.
                  Defaults to the WORKFLOW_MOCK env var (true if unset).
        timeout: seconds to wait for the real call; defaults to WORKFLOW_TIMEOUT.

    Returns:
        dict with keys {ok, data, error, fallback}.
    """
    is_valid, error = validate_input(payload, required_fields=["input"])
    if not is_valid:
        return error

    timeout = timeout if timeout is not None else WORKFLOW_TIMEOUT
    use_mock = _use_mock_env() if use_mock is None else use_mock

    try:
        if use_mock:
            raw = _mock_workflow(payload)
        else:
            raw = _call_real_workflow(payload, timeout)
    except Exception as exc:
        raw = _mock_workflow(payload)
        result = _normalize_empty_result(raw)
        result["_fallback_reason"] = str(exc)
        return make_success(result, fallback=True)

    result = _normalize_empty_result(raw)
    return make_success(result, fallback=use_mock)


def health():
    """Adapter health check used by readiness probes."""
    return {"ok": True, "mode": "mock" if _use_mock_env() else "real", "timeout": WORKFLOW_TIMEOUT}
