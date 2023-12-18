+++
title = "My Verilog ModelSim Testbench Templates"
description = ""
type = ["posts","post"]
tags = [
    "fpga",
    "development",
    "modelsim",
]
date = "2023-07-05 09:00:00"
categories = [
    "FPGA",
]
series = ["Field Programmable Gate Arrays"]
[ author ]
  name = "Hubert Choo"
+++

## Combinational Circuits
A sample testbench for one of my previous projects is here:

``` verilog
`timescale 1 ns/10 ps  // time-unit = 1 ns, precision = 10 ps

module GAUSSIAN_CONVOLUTION_TB;

    reg [3*3*8-1:0] color_matrix;
    wire [7:0]       conv_result;

    // duration for each period = 20 * timescale = 20 * 1 ns  = 20ns
    localparam period = 20;  

    reg return_black;

    GAUSSIAN_CONVOLUTION CONV (
        .color_matrix(color_matrix),
        .conv_result(conv_result),
        .return_black(return_black)
    );
    
    initial // initial block executes only once
        begin
            return_black = 0;
            // values for a and b
            color_matrix = {8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255};
            #period; // wait for period 

            color_matrix = {8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0};
            #period;

            color_matrix = {8'd255, 8'd10, 8'd45, 8'd65, 8'd36, 8'd47, 8'd53, 8'd111, 8'd200};
            #period;

            return_black = 1;

            color_matrix = {8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255, 8'd255};
            #period; // wait for period 

            color_matrix = {8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0, 8'd0};
            #period;

            color_matrix = {8'd255, 8'd10, 8'd45, 8'd65, 8'd36, 8'd47, 8'd53, 8'd111, 8'd200};
            #period;

        end
endmodule
```

A few important lines:
- `timescale 1 ns/10 ps`
- `localparam period = 20`
- `#period`
- See when `reg` and `wire` are used

## Sequential Circuits
A sample testbench for one of my previous projects is here:
``` verilog
module GAUSSIAN_BLUR_TB;
    reg clk;
    reg [10:0] x;
    reg [10:0] y;
    
    reg [7:0] curr_pixel_data;
    wire [7:0] blurred_pixel_data;

    integer write_data;
    integer i;

    // [7:0] 8 bits of data per pixel color
    // [0:63] a total of 64 pixels in 64 lines (8 lines of 8 pixels)
    reg [7:0] read_data [0:230400];

    GAUSSIAN_BLUR #(
        .LINE_WIDTH(640),
        .PIXEL_DATA_WIDTH(8),
        .NUM_ADDR_BITS_X(11),
        .NUM_ADDR_BITS_Y(11)
    )
        GB (
        .clk(clk),
        .x(x),
        .y(y),
        .curr_pixel_data(curr_pixel_data),
        .blurred_pixel_data(blurred_pixel_data),
        .in_valid(1'b1)
    );

    initial begin
        clk = 1'b0;
        repeat(230400*2) #10 clk = ~clk; // generate a clock
    end

    initial begin
        x = 1'b0;
        y = 1'b0;
        i = 0;
        $readmemh("test_input_output_files/dimmer_green_channel.txt", read_data);
        write_data = $fopen("test_input_output_files/dimmer_green_channel_out.txt");
        repeat(230400) @(posedge clk) begin
            curr_pixel_data = read_data[i];
            $fdisplay(write_data, "%h", blurred_pixel_data);
            i = i + 1;
            if (x == 639) begin
                x = 0;
                y = y + 1;
            end
            else x = x + 1;
        end
        $fclose(write_data);
    end

endmodule
```

A few lines to note:
- `$readmemb` used to read a file for binary data
- `$fopen` and `$fdisplay` used to write to file
- `integer i` used to iterate through data read array
- The setting up of the clock signal in the initial block
- The use of `repeat` to count the number of loops to make

## Sample of a self-checking + randomising testbench for combinatorial circuit:

The module file:

``` verilog
`timescale 1ns / 1ps

module adder(
    input logic [3:0] a, b,
    output logic [4:0] sum
    );
    
    assign sum = a + b;
    
endmodule

```

The testbench file with self checking + randomising:

``` verilog
`timescale 1ns / 1ps

module adder_tb();
    
    logic [3:0] a_in;
    logic [3:0] b_in;
    logic [4:0] result_out;
    logic [4:0] true_result;
    
    adder dut(a_in, b_in, result_out);
    
    localparam period = 10;
    
    initial begin
        repeat(10) begin
            a_in = $urandom_range(7, 0);
            b_in = $urandom_range(7, 0);
            true_result = a_in + b_in;
            #period;
            $display(result_out);
            $display(true_result);
            
            if (result_out != true_result) begin
                $error("Incorrect Output");
            end
            
        end
        
        $display("Test passed");
        $finish;

    end
    
endmodule

```

## Sample of a self-checking + randomising testbench for sequential circuit:

The module file:

``` verilog
`timescale 1ns / 1ps

module adder(
    input logic clk,
    input logic [3:0] a, b,
    output logic [4:0] sum
    );
    
    always_ff @(posedge clk) begin
        sum <= a + b;
    end
    
    
endmodule

```

The testbench file with self checking + randomising:

``` verilog
`timescale 1ns / 1ps

module adder_tb();
    
    logic clk;
    logic rst;
    logic [3:0] a_in;
    logic [3:0] b_in;
    logic [4:0] result_out;
    logic [4:0] true_result;
    
    localparam period = 10;
    
    adder dut(clk, rst, a_in, b_in, result_out);
    
    initial begin
        clk = 0;
        rst = 1;
        repeat(4) #(period/2) clk=~clk;
        rst = 0;
        forever #(period/2) clk=~clk;
     end
     
     initial begin
        a_in = 0;
        b_in = 0;
        //result_out = 0;
        true_result = 0;
        
        // wait for rst
        @(negedge rst);
        
        repeat (50) @(posedge clk) begin
            true_result = a_in + b_in; // do this before reassigning to show correct order
            #(1)
            a_in = $urandom_range(7, 0);
            b_in = $urandom_range(7, 0);
            
            $display("Result out:", result_out);
            $display("True Result:", true_result);
            $display("\n");
            
        end
        
    end
    
endmodule

```

### Some examples of randomiser functions in SV:

#### $urandom( ) and $random( )

eg. variable = $urandom(seed); //seed is an optional argument

#### $urandom_range()

The $urandom_range() function returns an unsigned integer within a specified range.

variable = $urandom_range( int unsigned maxval, int unsigned minval = 0 );

#### std::randomise()

Variables can be randomized by using std::randomize method. It can accept the inline constraints using the “with” clause.

std::randomize (variable);
std::randomize (variable) with { constraint's; };

std::randomize (variable-1, variable-2 ... variable-n);
std::randomize (variable-1, variable-2 ... variable-n) with { constraint's; };

eg std::randomize(data,data_x_4) with { data     == addr * 8; 
                                         data_x_4 == data * 4;   
                                     };