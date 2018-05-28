<?php
    require('../config.php');
?><!doctype html>
<html lang="en-US">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= $opts['name'] ?></title>
    <link rel="shortcut icon" href="favicon.png">
    <link rel="icon" href="favicon.png">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,400i,700" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <!--[if lt IE 9]>
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>

<body>
    <script>
        window.opts = <?= json_encode($opts) ?>
    </script>
    <main class="desktop"></main>
    <div id="content-library">
        <?php
            $opts['directory'][] = ['filename' => 'motd'];
            $prefix = '';

            function buildContentLibrary($items, $prefix = '') {
                foreach($items as $item) {
                    $id = str_replace('/', '-', $prefix) . (!empty($prefix) ? '-' : '') . $item['filename'];
                    print '<div class="item" id="content-' . $id . '">';
                    $path =  $prefix . (!empty($prefix) ? '/' : '') . $item['filename'];
                    require('../content/' . $path . '.html');
                    print '</div>';

                    if (!empty($item['items'])) {
                        buildContentLibrary($item['items'], $path);
                    }
                }
            }

            buildContentLibrary($opts['directory']);
        ?>
    </div>
    <script src="js/app.js"></script>
</body>
</html>
