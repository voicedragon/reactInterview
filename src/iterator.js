export class Iterator {
	constructor(array, index = 0) {
		this.array = array; this.index = index; this.current = this.array[this.index]
	}

	first() {
		var first = this.array[0];
	    return first
	}

	last() {
		var copy = [...this.array].reverse();
		return copy[0]
	}

	curr() {
		console.log(this.current)
		return this.current
	}

	hasNext() {
		var next = this.index < (this.array.length - 1);
		return next;
	}

	hasPrev() {

		var prev = this.index > 0
		return prev
	}

	next() {
		if (this.hasNext() === true) {
			this.index += 1;
			this.current = this.array[this.index];
			return this.current
		}

		else {
			return this.current
		}
	}

	prev() {
		if (this.hasPrev() === true) {
			this.index -= 1;
			this.current = this.array[this.index];
			return this.current
		}

		else {
			return this.current
		}
	}

}