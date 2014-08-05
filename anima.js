( function( win, _undefined )
{
	var _cssString2Number = function( cssString )
	{
		return +cssString.replace( /px/, '' );
	};

	var _anima = {
		objects: [],
		easings:
		{
			easeOutExpo: function( t, b, c, d )
			{
				return ( t == d ) ? b + c : c * ( -Math.pow( 2, -10 * t / d ) + 1 ) + b;
			}
		},
		tween: function( element, options )
		{
			var elementStyle = element.style,
				initialLeft = _cssString2Number( elementStyle.left ),
				initialWidth = _cssString2Number( elementStyle.width ),
				o = {
					element: element,
					elementStyle: elementStyle,
					duration: options.duration || 500,
					easing: options.easing || 'easeOutExpo',
					onStart: options.onStart,
					onComplete: options.onComplete,
					left: options.left === _undefined ? initialLeft : options.left,
					width: options.width === _undefined ? initialWidth : options.width,
					props: []
				};

			o.easingFunction = this.easings[ o.easing ] || this.easings.easeOutExpo;

			o.props = [
			{
				name: 'left',
				initialValue: initialLeft,
				finalValue: o.left,
				delta: o.left - initialLeft
			},
			{
				name: 'width',
				initialValue: initialWidth,
				finalValue: o.width,
				delta: o.width - initialWidth
			} ];

			// here we gooo
			o.startTime = +new Date();

			if ( o.onStart )
			{
				o.onStart();
			}

			this.objects.push( o );

			if ( !this.looping )
			{
				this.looping = true;
				this.renderLoop();
			}

			//this.framesCount = 0;

			return o;
		},
		renderLoop: function()
		{
			var now = +new Date(),
				i = this.objects.length,
				o, j, p, val, t;

			//this.framesCount++;

			while ( i-- )
			{
				o = this.objects[ i ];
				t = now - o.startTime;
				j = o.props.length;

				if ( t < o.duration ) // in progress
				{
					while ( j-- )
					{
						p = o.props[ j ];
						val = o.easingFunction( t, p.initialValue, p.delta, o.duration );
						o.elementStyle[ p.name ] = val + 'px';
					}
				}
				else // completed
				{
					while ( j-- )
					{
						p = o.props[ j ];
						o.elementStyle[ p.name ] = p.finalValue + 'px';
					}

					//console.log( 'Done: ' + this.framesCount + ' framesCount.' );

					this.objects.splice( i, 1 );

					if ( o.onComplete )
					{
						o.onComplete();
					}
				}
			}

			// "recursion"
			if ( this.objects.length > 0 )
			{
				requestAnimationFrame( this.renderLoop.bind( this ) );
			}
			else
			{
				this.looping = false;
			}
		}
	};

	win.Anima = _anima;
}( window ) );
