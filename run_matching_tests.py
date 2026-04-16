"""Legacy compatibility wrapper for the current matching engine.

The canonical Python execution truth now lives in `matching_engine.py`.
This file is retained so existing references do not break while the repository
finishes migrating away from the historical test-script name.
"""

from matching_engine import *  # noqa: F401,F403
