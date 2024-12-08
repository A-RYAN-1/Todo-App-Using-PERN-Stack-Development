CREATE DATABASE store;

CREATE TABLE todo 
(
    id SERIAL PRIMARY KEY;
    description VARCHAR(300);
);

/*
Microsoft Windows [Version 10.0.22631.4460]
(c) Microsoft Corporation. All rights reserved.

C:\Users\amazi>psql -U postgres
Password for user postgres:

psql (17.2)
WARNING: Console code page (437) differs from Windows code page (1252)
         8-bit characters might not work correctly. See psql reference
         page "Notes for Windows users" for details.
Type "help" for help.

postgres=# \l
                                                            List of databases
   Name    |  Owner   | Encoding | Locale Provider |      Collate       |       Ctype        | Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+--------------------+--------------------+--------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | English_India.1252 | English_India.1252 |        |           |
 template0 | postgres | UTF8     | libc            | English_India.1252 | English_India.1252 |        |           | =c/postgres          +
           |          |          |                 |                    |                    |        |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | English_India.1252 | English_India.1252 |        |           | =c/postgres          +
           |          |          |                 |                    |                    |        |           | postgres=CTc/postgres
(3 rows)

postgres=# CREATE DATABASE store;
CREATE DATABASE
postgres=# \c store
You are now connected to database "store" as user "postgres".
store=# \dt
Did not find any relations.
store=# CREATE TABLE todo (
store(# task_id SERIAL PRIMARY KEY,
store(# description VARCHAR(300)
store(# );
CREATE TABLE
store=# \dt
        List of relations
 Schema | Name | Type  |  Owner
--------+------+-------+----------
 public | todo | table | postgres
(1 row)
*/