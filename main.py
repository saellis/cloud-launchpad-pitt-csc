from flask import Flask, jsonify, render_template, request

from db import TodoDBClient

app = Flask(__name__)

db_client = TodoDBClient("data.sqlite")


@app.route("/readTodos", methods=["GET"])
def read_todos():
    todos = db_client.read_todos()
    return jsonify(todos)


@app.route("/addTodo", methods=["POST"])
def add_todo():
    item = request.get_json()["item"]
    id = db_client.insert_todo(item)
    return jsonify({"id": id})


@app.route("/removeTodo", methods=["POST"])
def remove_todo():
    id = int(request.get_json()["id"])
    db_client.remove_todo(id)
    return jsonify({"status": "success"})


@app.route("/")
def index():
    return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
