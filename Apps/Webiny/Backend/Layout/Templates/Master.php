<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=1">

    <title>Webiny Platform</title>
    <!--<script src="/Assets/traceur-runtime.js" type="text/javascript"></script>-->
    <script src="/Assets/traceur.js" type="text/javascript"></script>
    <script src="/Assets/system.js" type="text/javascript"></script>
    <link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,600,700" rel="stylesheet"
          type="text/css">
    <?php
    foreach ($data['assets']['css'] as $css) {
        echo '<link rel="stylesheet" href="' . $css . '">';
    }
    foreach ($data['assets']['js'] as $js) {
        echo '<script src="' . $js . '"></script>';
    } ?>
    <!-- Apps assets -->
    <script>
        var _appUrl = '<?php echo $data['App']->getConfig('Platform.WebPath');?>';
        var _apiUrl = '<?php echo $data['App']->getConfig('Platform.ApiPath');?>';
        var _backendPrefix = '<?php echo $data['App']->getConfig('Platform.Backend.Prefix');?>';
    </script>

    <!--<script src="/Build/Development/Backend/outfile.js"></script>-->
</head>
<body>
<div id="app"></div>
<script>
    System.baseURL = '/Build/Development/Backend';
    System.import('Webiny/Webiny').then(function(module){
        window.Webiny = module.default;
        System.import('App');
    });

</script>
</body>
</html>