<canvas id="snowcanvas"></canvas>

@section('events.scripts')
    <script src="/assets/js/jquery.let_it_snow.min.js"></script>
    <script type="text/javascript">
        $(document).ready( function() {
            var resizeCanvas = function() {
                var canvas = document.getElementById('snowcanvas');
                var scale = window.devicePixelRatio || 1;
                var width  = canvas.offsetWidth,
                    height = canvas.offsetHeight;
                if( canvas.width != width * scale || canvas.height != height * scale ) {
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                }
            };
            resizeCanvas();
            $(window).on('resize', resizeCanvas);
            $('#snowcanvas').let_it_snow({
                speed: 0.1337 * (window.devicePixelRatio || 1),
                size: 2 * (window.devicePixelRatio || 1),
                color: '#d4d8e1'
            });
        });
    </script>
@endsection
