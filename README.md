# SMS Spam Classification using Federated Learning

A privacy-oriented SMS client built with React and Flask. Containerized with Docker and hosted on AWS.

[OpenAPI Spec](https://app.swaggerhub.com/apis-docs/sid-sr/FedSMS/1.0.0)

## Notes:

1. Before running the backend (with `python backend/src/app.py`) ensure a virtual environment is created
   - Go to the backend folder and type `python -m venv venv`.
   - For Linux: `source ./venv/bin/activate`
   - For Windows: `venv\scripts\activate.bat`
   - Run `pip install -r requirements.txt` to install the packages.
2. Environment variables have default values (in `backend/src/app.py`).
