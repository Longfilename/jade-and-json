# Jade + JSON

## Synopsis

Store your content in a JSON file instead of in a Jade file with markup. This gulp file has a “json” task that reads in all JSON files and makes their contents available to the Jade engine through the “locals” parameter.

## How

![diagram the Jade + JSON build process](readme-diagram.png?raw=true “”)

## Why

Let’s take the example of a promotional module. This module is displayed on five different pages. The markup is the same, but the content needs to be different across these five pages. A typical approach would be to create five jade partials, each with the same markup structure, but different content.

This approach works, but it becomes an inconvenience when the markup needs to change. Now you have to change the markup in five places.

Using JSON to store the content, a markup change will only impact one jade file. And now you don’t have to worry about markup consistency.

## Installation

Prerequisites
- node

Installation of dependencies
- npm install

Run the project
- gulp