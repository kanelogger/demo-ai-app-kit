#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Neutral Flask admin shell for AI-generated PC backend apps.

This is a runnable skeleton. After the Agent adapts it with the business
requirements, it becomes the target application. Business pages, entities,
and workflow endpoints are added by the implementation step, not hard-coded
here.
"""

import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import workflow_adapter

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")

DEMO_USERS = [
    {"id": 1, "username": "admin", "password": "admin", "name": "管理员", "role": "admin"},
]


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        for user in DEMO_USERS:
            if user["username"] == username and user["password"] == password:
                session["user_id"] = user["id"]
                session["username"] = user["username"]
                session["name"] = user["name"]
                session["role"] = user["role"]
                return redirect(url_for("dashboard"))
        flash("用户名或密码错误", "error")
    return render_template("auth/login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))
    return render_template("dashboard/index.html")


@app.route("/api/workflow/demo", methods=["POST"])
def api_workflow_demo():
    """Diagnostic endpoint for the workflow adapter. Not part of the primary loop."""
    payload = request.get_json(silent=True) or {}
    result = workflow_adapter.call_workflow(payload)
    return jsonify(result), (200 if result.get("ok") else 400)


@app.route("/api/workflow/health")
def api_workflow_health():
    """Health check for the workflow adapter."""
    return jsonify(workflow_adapter.health())


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(debug=True, host="0.0.0.0", port=port)
