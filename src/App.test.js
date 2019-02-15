import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Iterator } from "./iterator";

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});

var testArray = ["one", "two", "three", "four"];
var testIteration = new Iterator(testArray);

it("testsOperatorFirst", () => {
	expect(testIteration.first()).toEqual("one");
});

it("testsOperatorLast", () => {
	expect(testIteration.last()).toEqual("four");
});

it("testsOperatorCurr", () => {
	expect(testIteration.curr()).toEqual("one");
});

it("testsOperatorHasNext", () => {
	expect(testIteration.hasNext()).toBe(true);
});

it("testsOperatorHasPrev", () => {
	expect(testIteration.hasPrev()).toBe(false);
});

it("testsOperatorNext", () => {
	expect(testIteration.next()).toEqual("two");
});

it("testsOperatorPrev", () => {
	expect(testIteration.prev()).toEqual("one");
});