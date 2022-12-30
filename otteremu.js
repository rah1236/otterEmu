function bin(n)
{
    let rVal = new String
    let i;
    rVal += "0";
    for (i = 1 << 30; i > 0; i = Math.floor(i/2))
    {
        if((n & i) != 0)
        {
            rVal += "1";
        }
        else
        {
            rVal += "0";
        }
    }

    return rVal;
}

class RiscVEmulator {
    constructor() {
        // Initialize registers and memory

        this.registers = new Uint32Array(32);
        this.registers[0] = 0
        this.memory = new Uint8Array(1 << 20); // 1MB of memory

        // Set program counter to the start of the program
        this.pc = 0;

        // Initialize interrupt status register
        this.interrupt_status = 0;

        //Initialize LEDS
        this.LEDS = new Uint8Array()

        //Initialize Switches
        this.switches = new Uint8Array()
    }
  
    getLEDS(){
        // Get current LED array
        return(this.LEDS)
    }

    loadSwitches(switchnum, state){
        // Set switch state
        this.switches[switchnum] = state
    }
    
    getReg(registerNum){
        // Get register value
        return(this.registers[registerNum])
    }

    getPC(){
        //returns pc
        return(this.pc)
    }
    reset(){
        //resets PC, registers, and memory
        this.registers = new Uint32Array(32)
        this.registers[0] = 0
        this.memory = new Uint8Array(1 << 20);
        this.pc = 0
    }
    test() {
        console.log(this.memory[0].toString(16) + this.memory[1].toString(16) + this.memory[2].toString(16)+ this.memory[3].toString(16))
        console.log(this.registers[1].toString(16))
    }
  
    loadProgram(instructions) {
        console.log("Loading assembly")
        // Load a list of instructions into memory
        var memI, instI;
        for (memI = 0, instI = 0; instI < instructions.length, memI < instructions.length*4 ; memI = memI + 4, instI++) {
            this.memory[memI] =   (parseInt(instructions[instI], 16) >> 24 & 0xff);
            this.memory[memI+1] = (parseInt(instructions[instI], 16) >>  16) & 0xff;
            this.memory[memI+2] = (parseInt(instructions[instI], 16) >> 8) & 0xff;
            this.memory[memI+3] = (parseInt(instructions[instI], 16)) & 0xff;
        }
    }

    
  
    step() {
        // Fetch the instruction at the current program counter
        let instruction = parseInt(this.memory[this.pc].toString(16) + this.memory[this.pc+1].toString(16) + this.memory[this.pc + 2].toString(16)+ this.memory[this.pc + 3].toString(16), 16)
        // Decode and execute the instruction
        if (this.memory[i] != null){
            this.execute(instruction)
        }
        else{
            this.registers[0] = "Memory Blank"
        }
    }
    
    run(){
        //run whatever is in memory starting from 0
        for (let i = 0; i < this.memory.length; i = i + 4){
            let instruction = parseInt(this.memory[this.pc].toString(16) + this.memory[this.pc+1].toString(16) + this.memory[this.pc + 2].toString(16)+ this.memory[this.pc + 3].toString(16), 16)
            if (this.memory[i] != 0){
                this.execute(instruction)
                console.log("Ran instruction at 0x" + i.toString(16))

            }
            else{
                this.registers[0] = "Memory Blank"
            }
        }
    }

    execute(instruction) {
        this.registers[0] = 0
        
        // Decode the instruction
        let opcode = instruction & 0b1111111;
        let rd = (instruction >> 7) & 0b11111;
        let rs1 = (instruction >> 15) & 0b11111;
        let rs2 = (instruction >> 20) & 0b11111;
        let func3 = (instruction >> 12) & 0b111;
        let func7 = (instruction >> 30) & 0b1;
        let imm = instruction >> 20;
        console.log("imm " + imm.toString(10))
        console.log("opcode " + opcode.toString(2))
        console.log("func3 = " + func3.toString(2))
        console.log("instru = " +instruction.toString(2))
        //console.log(" bit = ")
        let s_type_imm = (instruction & 0x80000000, (instruction & 0x7E000000) >> 25, (instruction & 0xF80) >> 7)
        let b_type_imm = (instruction & 0x80000000, (instruction & 0x80) >> 7, (instruction & 0x7E000000) >> 25, (instruction & 0x78) >> 3, 0)
        let u_type_imm = ((instruction >> 12) & 0b11111111111111111111) << 12
        let j_type_imm = (instruction & 0x80000000, (instruction & 0xFF000) >> 12, (instruction & 0x100000) >> 20, (instruction & 0x3E00000) >> 21, 0)


        // Execute the instruction
        if (opcode === 0b0010011) {
           // immediate based OPCODE
           if (func3 === 0b000) {
                // ADDI instruction
                console.log("Adding immediate")
                this.registers[rd] = this.registers[rs1] + imm;
                this.pc += 4;
           } 
           else if (func3 === 0b010) {
                // SLTI instruction
                this.registers[rd] =
                   this.registers[rs1] < imm ? 1 : 0; // X[rd] ← ( X[rs1] <s sext(imm) ) ? 1 : 0
                this.pc += 4;
           } 
           else if (func3 === 0b011) {
                // SLTIU instruction
                this.registers[rd] =
                  new Uint32Array(this.registers[rs1]) < new Uint32Array([imm]) ? 1 : 0;
                this.pc += 4;
           }
           else if (func3 === 0b110){
                // ORI instruction
                this.registers[rd] = this.registers[rs1] | imm;
                this.pc += 4;
           } 
           else if (func3 === 0b100){
                // XORI instruction
                this.registers[rd] = this.registers[rs1] ^ imm;
                this.pc += 4;
           }   
           else if (func3 === 0b111){
                // ANDI instruction
                this.registers[rd] = this.registers[rs1] & imm;
                this.pc += 4;
           }
           else if (func3 === 0b101){
                // SLLI instruction
                this.registers[rd] = this.registers[rs1] << imm;
                this.pc += 4;
           }
           else if (func3 === 0b001){
            // SRLI instruction
            this.registers[rd] = this.registers[rs1] >> imm;
            this.pc += 4;
           }
        }
        else if (opcode === 0b1100011){
            //B-type instructions
            if (func3 === 0b0){
                // BEQ instruction
                if (this.registers[rs1] === this.registers[rs2]){
                    self.pc += b_type_imm + self.pc }
                else{ this.pc += 4 } 
            }
            if (func3 === 0b001){
                // BNE instruction
                if (this.registers[rs1] != this.registers[rs2]){
                    self.pc += b_type_imm + self.pc }
                else{ this.pc += 4 } 
            }
            if (func3 === 0b100){
                // BLT instruction
                if (this.registers[rs1] < this.registers[rs2]){
                    self.pc += b_type_imm + self.pc }
                else{ this.pc += 4 } 
            }
            if (func3 === 0b101){
                // BGE instruction
                if (this.registers[rs1] > this.registers[rs2]){
                    self.pc += b_type_imm + self.pc }
                else{ this.pc += 4 } 
            }
            if (func3 === 0b110){
                // BLTU instruction
                if (new Uint32Array(this.registers[rs1]) < new Uint32Array(this.registers[rs2])){
                    self.pc += b_type_imm + self.pc }
                else{ this.pc += 4 } 
            }
            if (func3 === 0b111){
                // BGEU instruction
                if (new Uint32Array(this.registers[rs1]) > new Uint32Array(this.registers[rs2])){
                    self.pc += b_type_imm + self.pc }
                else{ this.pc += 4 } 
            }
        }
        else if (opcode === 0b0110111){
            // LUI instruction
            this.registers[rd] = u_type_imm
            this.pc += 4
        }
        else if (opcode === 0b0010111){
            // AUIPC instruction
            this.registers[rd] = this.pc + u_type_imm;
            this.pc += 4
        }
        else if (opcode === 0b1101111){
            // JAL instruction
            this.registers[rd] = this.pc + 4;
            this.pc = self.pc + j_type_imm;
        }
        else if (opcode === 0b1100111){
            // JALR instruction
            this.registers[rd] = this.pc + 4;
            this.pc = this.registers[rs1] + j_type_imm;
        }
        else if (opcode === 0b0110011){
            // R-Type instructions
            if (func3 === 0b0){
                if (!func7){
                    // AND instruction
                    this.registers[rd] = this.registers[rs1] + this.registers[rs2];
                }
                else {
                    // SUB instruction
                    this.registers[rd] = this.registers[rs1] - this.registers[rs2];
                }
            }
            else if (func3 === 0b001){
                // SLL instruction
                this.registers[rd] = this.registers[rs1] << this.registers[rs2];
            }
            else if (func3 === 0b010){
                // SLT instruction
                if (this.registers[rs1] < this.registers[rs2]){
                    this.registers[rd] = 1
                }
                else{ this.registers[rd] = 0 }
            }
            else if (func3 === 0b011){
                // SLTU instruction
                if (new Uint32Array(this.registers[rs1]) < new Uint32Array(this.registers[rs2])){
                    this.registers[rd] = 1
                }
                else{ this.registers[rd] = 0 }
            }
            else if (func3 === 0b100){
                // XOR instruction
                this.registers[rd] = this.registers[rs1] ^ this.registers[rs2];
            }
            else if (func3 === 0b101){
                // SRL/SRA instruction
                this.registers[rd] = this.registers[rs1] >> this.registers[rs2];
            }
            else if (func3 === 0b110){
                // OR instruction
                this.registers[rd] = this.registers[rs1] | this.registers[rs2];
            }
            else if (func3 === 0b100){
                // AND instruction
                this.registers[rd] = this.registers[rs1] & this.registers[rs2];
            }
            this.pc += 4;
        }
        else if (opcode === 0b0000011){
            // L-type instructions
            address = self.registers[rs1] + imm;
            if (address === 0x11008000){
                //load on switch state
                this.registers[rd] = this.switches;
            }
            else if (func3 === 0b000){
                // LB instruction
                this.registers[rd] = this.memory[address]
            }
            else if (func3 === 0b010) {
                // LH instruction
                this.registers[rd] =
                  (this.memory[address] << 8) | this.memory[address + 1];
            } 
            else if (func3 === 0b011) {
                // LW instruction
                this.registers[rd] =
                (this.memory[address] << 24) |
                (this.memory[address + 1] << 16) |
                (this.memory[address + 2] << 8) |
                this.memory[address + 3];
            }
            else if (func3 === 0b100) {
                // LBU instruction
                this.registers[rd] = new Uint32Array([this.memory[address]])[0];
              } 
            else if (func3 === 0b101){
                // LHU instruction
                this.registers[rd] = new Uint32Array((this.memory[address] << 24) |
                (this.memory[address + 1] << 16) |
                (this.memory[address + 2] << 8) |
                this.memory[address + 3])
            }
            this.pc += 4
        }
        else if (opcode === 0b010011){
            address = self.registers[rs1] + imm
            //STORE instructions
            if (address === 0x11008000){
                //store to LEDs
                this.LEDS = self.registers[rd]
            }
            else if (func3 === 0b000){
                // SB instruction
                this.memory[address] = self.registers[rd];
            }
            else if (func3 === 0b001) {
                // SH instruction
                this.memory[address] = this.registers[rd] >> 8;
                this.memory[address + 1] = this.registers[rd] & 0xff;
            } 
            else if (func3 === 0b010) {
                // SW instruction
                this.memory[address] = this.registers[rd] >> 24;
                this.memory[address + 1] = (this.registers[rd] >> 16) & 0xff;
                this.memory[address + 2] = (this.registers[rd] >> 8) & 0xff;
                this.memory[address + 3] = this.registers[rd] & 0xff;
            }
            this.pc += 4;           
        }


    }
}   