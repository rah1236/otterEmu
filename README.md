# otterEmu

otterEmu is a JavaScript based emulator for the RISC-V Otter CPU, used in CPE 233 and 333 at Cal Poly SLO to teach computer architecture. 

otterEmu is just a winter break boredom project, and is extremely broken, expect nothing to work besides basic instructions at the moment. The end goal is for this to act as a stand in for the Basys-3 development board in order for students and instructors to develop assembly programs and subroutines without needing the hardware. 

# How to use

otterEmu is built as a Javascript class, so you can implement it however you want in any project you want. Just create a RiscVEmulator() object and wail away. 

If you just want to play with the emulator in its current state, 
- clone the repo 
- open test.html 
- drop your compiled assembly in the text box
- click on reset, then click on load
- after that your program is in memory, you can either step through, or run your program all at once

To write and compile assembly, [Venus](https://venus.kvakil.me) is an excellent option.

## TODO

- Buggy adding in immediates
- Add unsigned instructions (they currently behave as signed instructions)
- Implement interrupts 
- Add LED Display and test
- Add Switches and buttons
- Add viewable and updating memory in HTML
- And so much more!



## Special Thanks

Thanks to Grace, Miles, and Noah for getting me through 233, Dash, Professor Callenes-Sloan, and probably most of all Professor Mealy for putting together and awesome class, and set of textbooks, and for ultimately giving me a C+ in the course. This Emulator is deserving of about that grade too.
