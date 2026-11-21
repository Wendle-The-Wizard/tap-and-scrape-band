# Tap and Scrape Band

A little browser toy where a row of tapping and scraping instruments play a rhythm together. I'm building it one step at a time.

Right now (step 3) each instrument has its own 16-step pattern that loops forever. Under every instrument is a grid of dots: a coloured dot is a beat where it plays, and a white ring shows which step the band is on. The sounds are made with the Web Audio API: a woodblock tock, claves clack, a guiro scrape, a triangle ting and a shaker shh.

To play, tap or click the stage. The band starts looping, and tapping an instrument still makes it sound by itself. Next I'll let you click dots to switch steps on and off, and add a tempo slider and a start button.
