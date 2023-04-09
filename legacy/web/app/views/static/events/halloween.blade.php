<div id="halloween">
    {{ Helper::webp(Helper::cdn('assets/img/halloween.webp'), Helper::cdn('assets/img/halloween.png'), 318, 312) }}
</div>
<style>
    #halloween {
        position: absolute;
        right: 50px;
        top: 0;
        overflow: hidden;
        height: 234px;
        pointer-events: none;
        user-select: none;
    }
    #halloween img {
        height: 234px;
        width: auto;
        position: relative;
        top: -50px;
    }
    @media ( max-width: 800px ) {
        #halloween img {
            height: 100px;
            top: -20px;
        }
    }
</style>
