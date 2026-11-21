# Tap and Scrape Band

A little browser toy where a row of tapping and scraping instruments play a rhythm together. I built it one step at a time, and this is the last step.

Press the Start button to wake the band. It loops forever. Under every instrument is a grid of 16 dots: a coloured dot is a step where it plays, a dark dot is silent. Tap a dot to switch it on or off, even while the band plays. A white ring shows the current step in every grid, and a row of 16 lights along the bottom follows along too.

Drag the tempo slider to make the band slower or faster, from 60 to 180 beats per minute. Press Stop when you want some quiet. You can also tap an instrument to hear it on its own.

The sounds come from the Web Audio API: a woodblock tock, claves clack, a guiro scrape, a triangle ting and a shaker shh.
