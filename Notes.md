# Allgemein

#### Usefull Links
- Parameters Hilfe https://scicomp.stackexchange.com/questions/14450/how-to-get-proper-parameters-of-sph-simulation



# WHATS NEXT

#### Erweiterungen 
- neuer wasserqube droppen bei tastendruck
- trichter bzw platte mit loch oder so implementieren 
- 3d terrain
- leapfog anstatt euler https://gamedev.stackexchange.com/questions/96963/leapfrog-integration-vs-euler-integrator

#### Optimierung durch Parallelisierung oder GPU
- twgl ersetzen mit https://github.com/greggman/twgl.js/blob/master/dist/4.x/twgl-full.module.js?
- Unterteilung des Raumes in Teile. Je Teil dann ein Webworker zur Berechnung. Außengrenze zum Beziehen benachbarter Parikel ist Teilgrenze +/- PartiklBreite 

#### Surface Rendering
- insofern rendern rechenintensiv ist: rendern und simulation in seperaten thread (https://www.html5rocks.com/de/tutorials/workers/basics/)
- rendern mit alter kopie, simulation berechnet neuen 

