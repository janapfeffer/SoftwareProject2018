F�r die Verwendung der Datenbank muss folgendes installiert werden:
1. MySQL
- https://www.microsoft.com/en-us/download/confirmation.aspx?id=48145
- https://dev.mysql.com/downloads/file/?id=479862
- ggf weitere ben�tigte Vorinstallierungen, auf die wird w�hrend der Installation von MySQL hingewiesen
wichtig: MySQL Workbench 
Als root user: "root"
Als root passwort: "password"
(oder sp�ter die files f�r den pers�nlichen User anpassen)
2. Node.js installieren
- https://nodejs.org/dist/v10.12.0/node-v10.12.0-x64.msi

Um die Tabellen etc. in die Datenbank zu bekommen, muss folgendes ausgef�hrt werden:
1. MySQL Workbench �ffnen
2. MySQl Connection (lokale Instanz) ausw�hlen
3. a) Tab Server > Data Import > Backup File von Git ausw�hlen
   b) gesamten Inhalt des Backup Files kopieren und als SQL Query ausf�hren

Die Verbindung kann �ber die Ausf�hrung des Files db_connection getestet werden:
1. Command Line (cmd) �ffnen
2. in das Verzeichnis, in dem das File gespeichert ist, navigieren (mit cd)
3. ausf�hren �ber: node db_connection.js
Gew�nschte Ausgabe: 
	Connected to database.
	Disconnected from database.

PROBLEMBEHANDLUNG
Sollte beim Starten der MySQL Workbench der Server nicht laufen (Status == stopped):
Server > Startup/Shutdown > auf start server klicken

Wenn das Datenmodell ge�ndert wird und eine neue Spalte mit foreign key hinzukommt, d�rfen 
keine tabelleneintr�ge vorhanden sein.
Es k�nnen im Nachhinein keine Spalten als "zu generieren" eingestellt werden.
