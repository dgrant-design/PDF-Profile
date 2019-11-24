
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML");
const html = "index.html";
const pdf = require("html-pdf")

async function printPDF() {
    var fullHTML = fs.readFileSync('./index.html', 'utf8');
    var options = { format: 'A4' };

    pdf.create(fullHTML, options).toFile('./test.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res)
    })

}


function writeToFile(html, data) {
    fs.writeFile(html, data, function (err) {
        if (err) {
            return Error;
        }
    });
}

function appendToFile(html, data) {
    fs.appendFile(html, data, function (err) {
        if (err) {
            return Error;
        } else {
            printPDF();
        }

    });

}

function init() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "username",
                message: "Enter your GitHub username: "
            },
            {
                type: "list",
                message: "Choose one of the following colors for your profile:",
                name: "color",
                choices: ["green", "blue", "pink", "red"]
            }
        ])
        .then(function (data) {
            writeToFile(html, generateHTML.generateHTML(data));
            return data;
        })
        .then(function (data) {
            const queryUrl = `https://api.github.com/users/${data.username}`;
            axios.get(queryUrl).then(function (res) {
                appendToFile(html, generateHTML.gitInfo(res));
            });
        });
}

init();