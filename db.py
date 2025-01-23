import sqlite3


class TodoDBClient:
    def __init__(self, db_file: str) -> None:
        self.db_file = db_file
        with sqlite3.connect(self.db_file) as conn:
            conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("""
            CREATE TABLE IF NOT EXISTS todo_list (
                id INTEGER PRIMARY KEY,
                todo TEXT NOT NULL
            );
            """)

    def read_todos(self) -> dict[int, str]:
        with sqlite3.connect(self.db_file) as conn:
            return dict(
                conn.execute("SELECT id, todo FROM todo_list;").fetchall()
            )

    def insert_todo(self, todo: str) -> int:
        id = None
        with sqlite3.connect(self.db_file) as conn:
            # id = conn.execute("INSERT INTO todo_list (todo) VALUES (?) RETURNING id;", (todo,)).fetchall()[0][0]
            conn.execute("INSERT INTO todo_list (todo) VALUES (?);", (todo,))
            id = conn.execute("SELECT * FROM todo_list ORDER BY id DESC;").fetchall()[0][0]
            conn.execute("COMMIT;")
        return id
        
    def remove_todo(self, index: int) -> None:
        with sqlite3.connect(self.db_file) as conn:
            conn.execute("DELETE FROM todo_list WHERE id = ?", (index, ))
