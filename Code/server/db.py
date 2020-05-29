import psycopg2

#connect to the db
con = psycopg2.connect(
    host="localhost",
    database="postgres",
    user="postgres",
    password="huong",
    port="5432"
)

#close the connection
con.close()