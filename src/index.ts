import { connectToDb } from "./db/connection.js";
import "./menu.js";
import figlet from "figlet";

// Generate ASCII text
const employeeText = figlet.textSync("Employee", {
    font: "Standard", 
    horizontalLayout: "default",
    verticalLayout: "default",
    whitespaceBreak: true
});

const managerText = figlet.textSync("Manager", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    whitespaceBreak: true
});

// Combine text with spacing
const asciiArt = `${employeeText}\n\n${managerText}`;

// Define width dynamically based on the longest line
const maxLineLength = Math.max(...asciiArt.split("\n").map(line => line.length)) + 3;

// Create uniform dashed border
const topBorder = `╭${'╌'.repeat(maxLineLength)}╮`;
const bottomBorder = `╰${'╌'.repeat(maxLineLength)}╯`;

// Format each line to be aligned left
const contentLines = asciiArt.split("\n").map(line => `╎ ${line.padEnd(maxLineLength - 2)} ╎`).join("\n");

// Final box
const boxedText = `${topBorder}\n${contentLines}\n${bottomBorder}`;

console.log(boxedText);

