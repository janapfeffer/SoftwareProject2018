Für die Verwendung der Datenbank muss folgendes installiert werden:
1. MySQL
- https://www.microsoft.com/en-us/download/confirmation.aspx?id=48145
- https://dev.mysql.com/downloads/file/?id=479862
- ggf weitere benötigte Vorinstallierungen, auf die wird während der Installation von MySQL hingewiesen
wichtig: MySQL Workbench 
Als root user: "root"
Als root passwort: "password"
(oder später die files für den persönlichen User anpassen)
2. Node.js installieren
- https://nodejs.org/dist/v10.12.0/node-v10.12.0-x64.msi

Um die Tabellen etc. in die Datenbank zu bekommen, muss folgendes ausgeführt werden:
1. MySQL Workbench öffnen
2. MySQl Connection (lokale Instanz) auswählen
3. a) Tab Server > Data Import > Backup File von Git auswählen
   b) gesamten Inhalt des Backup Files kopieren und als SQL Query ausführen

Die Verbindung kann über die Ausführung des Files db_connection getestet werden:
1. Command Line (cmd) öffnen
2. in das Verzeichnis, in dem das File gespeichert ist, navigieren (mit cd)
3. ausführen über: node db_connection.js
Gewünschte Ausgabe: 
	Connected to database.
	Disconnected from database.

PROBLEMBEHANDLUNG
Sollte beim Starten der MySQL Workbench der Server nicht laufen (Status == stopped):
Server > Startup/Shutdown > auf start server klicken

Wenn das Datenmodell geändert wird und eine neue Spalte mit foreign key hinzukommt, dürfen 
keine tabelleneinträge vorhanden sein.
Es können im Nachhinein keine Spalten als "zu generieren" eingestellt werden.
