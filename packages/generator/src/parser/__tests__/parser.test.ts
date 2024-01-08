import { describe, expect, it } from "vitest"
import { Tokenizer } from "../tokenizer.js"
import { Parser } from "../parser.js"

describe("Parser", () => {
    const easyHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <html>
            <head>
                <title>Page Title</title>
                <!DOCTYPE html>
        <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading  <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>  <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html><head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html><head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html> <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading  <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <html>
            <head>
                <title>Page Title</title>
                <meta charset="UTF-8" />
                <meta name="description" content="Free Web tutorials" />
            </head>
            <body>
                <h1>My First Heading <div className="love two"/></h1>
                <p>My first paragraph.</p>
            </body>
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>  <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html><head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html><head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html> <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.
            <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>   <head>
            <title>Page Title</title>
            <meta charset="UTF-8" />
            <meta name="description" content="Free Web tutorials" />
        </head>
        <body>
            <h1>My First Heading <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
        </body> <div className="love two"/></h1>
            <p>My first paragraph.</p>
        </body>
            </p>
        </body></p>
        </body>
            </p>
        </body>
        </html>
`

    // setup tokenizer
    const tokenizer = new Tokenizer()
    tokenizer.init(easyHtml)
    const tokens = tokenizer.tokenize()
    // setup parser
    const parser = new Parser()
    parser.init(tokens)

    // generate ast
    const ast = parser.parse()

    it("Should parse HTML ast", () => {
        expect(ast).toMatchSnapshot()
    })
})
