import pymysql

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="ekipman_takip",
        cursorclass=pymysql.cursors.DictCursor
    )

