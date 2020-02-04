### Testing
- Skripte asusführbar mit `node test.js`
- Damit Node die Skripte als Module sieht braucht es die `package.json` im Root Bereich, die genau das definiert (https://stackoverflow.com/questions/58384179/syntaxerror-cannot-use-import-statement-outside-a-module)

#### Erweiterungen 
- trichter bzw platte mit loch oder so implementieren 
- 3d terrain
- leapfog anstatt euler https://gamedev.stackexchange.com/questions/96963/leapfrog-integration-vs-euler-integrator

#### Optimierung durch WebWorker oder GPU
- Unterteilung des Raumes in Teile. Je Teil dann ein Webworker zur Berechnung. Außengrenze zum Beziehen benachbarter Parikel ist Teilgrenze +/- PartiklBreite 

#### Surface Rendering
- insofern rendern rechenintensiv ist: rendern und simulation in seperaten thread (https://www.html5rocks.com/de/tutorials/workers/basics/)
- rendern mit alter kopie, simulation berechnet neuen 

