<?php

    $phone = "";
    // удаляем все символы, кроме цифр
    if (isset($_POST['PHONE_MOBILE']))
        $phone = preg_replace('/\D/', '', $_POST['PHONE_MOBILE']);

    $name = $_POST['NAME'];
    $comment = $_POST['COMMENTS'];
    //
    $result = createBitrixLead($name, $phone, $comment);

    header('Content-type: application/json');
    echo json_encode($result);



    /**
     * Запрос в api.cek.ru
     */
    function createBitrixLead($name, $phone, $comment)
    {
        // формируем URL в переменной $queryUrl для обращения через вебхук
        $queryUrl = 'https://bitrix.cek.ru/rest/89/ffrdac5rlarvvqc7/crm.lead.add.json';
        $bitrix_arg = array(
            //новыый
            "STATUS_ID" => "NEW",
            //доступен всем
            "OPENED" => "Y",
            //Наименование лида.
            'TITLE' => 'Заполнение формы "reg.cek.ru"',
            //идентификатор ответственного лица
            'ASSIGNED_BY_ID' => '11',
            //имя клиента из формы
            'NAME' => $name,
            //мобильный телефон клиента из формы
            'PHONE' => isset($phone) ? array(array('VALUE' => $phone, 'VALUE_TYPE' => 'MOBILE')) : array(),
            //комментарий клиента из формы
            'COMMENTS' => $comment,
            //Тариф формы (какая именно кнопка была нажата)
            'UF_CRM_1563785863' => isset($_POST['UF_CRM_1563785863']) ? $_POST['UF_CRM_1563785863'] : array(),
        );
        // добавляем массив utm-параметров (если они есть)
        $bitrix_arg = array_merge($bitrix_arg, $_POST['UTM_CEK_ADV']);
        // формируем параметры для создания лида в переменной $queryData
        $queryData = http_build_query(array(
            'fields' => $bitrix_arg,
            'params' => array("REGISTER_SONET_EVENT" => "Y")
        ));
        // обращаемся к Битрикс24 при помощи функции curl_exec
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_POST => 1,
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $queryUrl,
            CURLOPT_POSTFIELDS => $queryData,
        ));

        if ($data = curl_exec($curl)) {
            $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            if ($http_code >= 200 && $http_code < 300) {
                $result['success'] = true;
                $result['data'] = $data;
                $result['http_code'] = $http_code;
            } else {
                $result['success'] = false;
                $result['http_code'] = $http_code;
                $result['url'] = $curl;
            }
        } else {
            $result['success'] = false;
            $result['curl_error_code'] = curl_errno($curl);
        };

        curl_close($curl);
        return $result;
    }
    
?>