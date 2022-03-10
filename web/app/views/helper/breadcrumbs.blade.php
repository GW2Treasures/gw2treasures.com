<?php $breadcrumbs = array_values(array_filter($breadcrumbs)); ?>

<nav class="details__breadcrumb">
    @for($i = 0; $i < count($breadcrumbs) - 2; $i++)
        @if(isset($breadcrumbs[$i][1]))
            <a href="{{$breadcrumbs[$i][1]}}" class="breadcrumb-{{$i}}">{{$breadcrumbs[$i][0]}}</a>
        @else
            <span>{{$breadcrumbs[$i][0]}}</span>
        @endif
        <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
    @endfor
    @if(isset($breadcrumbs[$i][1]))
        <a href="{{$breadcrumbs[$i][1]}}" class="breadcrumb-{{$i}}">{{$breadcrumbs[$i][0]}}</a>
    @else
        <span>{{$breadcrumbs[$i][0]}}</span>
    @endif

    <script type="application/ld+json">
        {"{{'@context'}}": "http://schema.org","@type": "BreadcrumbList","itemListElement": [
            @for($i = 0; $i < count($breadcrumbs); $i++)
                @if(isset($breadcrumbs[$i][1]))
                    {
                        "@type": "ListItem",
                        "position": {{$i + 1}},
                        "item": {
                            "@id": "{{$breadcrumbs[$i][1]}}",
                            "name": "{{$breadcrumbs[$i][0]}}"
                        }
                    }
                    @if($i < count($breadcrumbs) - 1)
                        ,
                    @endif
                @endif
            @endfor
        ]}
    </script>
</nav>
