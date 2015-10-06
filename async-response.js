import Response from "./response";

/**
 */

function AsyncResponse(run) {
	Response.call(this);
	this._chunks = [];

	// todo - pass writable instead
	if(run) run(this);
}

/**
 */

Object.assign(AsyncResponse.prototype, Response.prototype, {

	/**
	 * super private
	 */

	__signalWrite: function() { },

	/**
	 */

	read: function() {

		if (!!this._chunks.length) {
			var chunk = this._chunks.shift();
			return Promise.resolve(chunk);
		}

		if (this._ended) {
			return Promise.resolve(void 0);
		}

		return new Promise((resolve, reject) => {
			this.__signalWrite = () => {
				this.__signalWrite = () => { };
				this.read().then(resolve, reject);
			}
		});
	},

	/**
	 */

	write: function(chunk) {
		this._chunks.push(chunk);
		this.__signalWrite();
	},

	/**
	 */

	end: function(chunk) {

		if (chunk != void 0) {
			this.write(chunk);
		}

		this._ended = true;
		this.write(void 0);
	}
});

/**
 */

export default AsyncResponse;
