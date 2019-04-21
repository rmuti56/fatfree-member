<?php
class Api
{
    private $db, $log_api_calls,$session = true;
    public function __construct()
    {
        $this->db=new DB\SQL(
            'mysql:host=localhost;port=3308;dbname=member_db',
            'root',
            'root'
        );
       
    }

    //แสดงข้อมูลสมาชิกคนเดียว
    public function getUpdate($f3){
         $id=$f3->get('PARAMS.id');
        if($id != ''){
            $result = $this->searchById($id);
            $data = [
                'data' => $result,
            ];
            $json_data = json_encode($data);
            echo $json_data;
        }
    }

   
    //แสดงข้อมูลสมาชิก
    public function getUsersAll($f3)
    {
        $member_table = "member_tbl";
        $position_table = "position_tbl";
        $role_table = "role_tbl";
        $search=$f3->get('GET.search');
        $key=$f3->get('GET.key');        
        if($key != '' && $search != '') {
            if( $search == "รหัส"){
                $result = $this->searchById($key);
            }else if( $search == "ชื่อ"){
                
                $column = "firstname";
                $result = $this->searchBy($key ,$column,$member_table);
            }
            else if( $search == "นามสกุล"){
                $column = "lastname";
                $result = $this->searchBy($key,$column,$member_table);
            }
            else if( $search == "อีเมลล์"){
                $column = "email";
                $result = $this->searchBy($key,$column,$member_table);
            }
            else if( $search == "ตำแหน่ง"){
                $column = "position_name";
                $result = $this->searchBy($key,$column,$position_table);
            }else{
                $column = "role_name";
                $result = $this->searchBy($key,$column,$role_table);
            }
            $data = [
                'data' => $result,
            ];
            $json_data = json_encode($data);
            echo $json_data;
        }else{
            $api_data = $this->get_user_array();
            $data = [
                'data' => $api_data,
            ];
            $json_data = json_encode($data);
            echo $json_data;
        }
       
    }

    //ค้นหาตาม id
    private function searchById($key){
        $api_data = $this->db->exec("SELECT  mid,email,password,firstname,lastname,updated,images,position_name,role_name
        FROM member_tbl,position_tbl,role_tbl
        WHERE member_tbl.position = position_tbl.pid AND member_tbl.role = role_tbl.rid AND member_tbl.mid = :key
         ORDER BY updated DESC",array(
             ':key' => $key
         ));
       return $api_data;
    }
    //ค้นหาตาม firstname
    private function searchBy($key,$column,$table){
        $api_data = $this->db->exec("SELECT  mid,email,password,firstname,lastname,updated,position_name,role_name
        FROM member_tbl,position_tbl,role_tbl
        WHERE member_tbl.position = position_tbl.pid AND member_tbl.role = role_tbl.rid AND $table.$column Like :key
         ORDER BY updated DESC",array(
             ':key' => '%'.$key.'%'
         ));
       return $api_data;
    }
    
    //นำข้อมูลทั้งหมดมาแสดง
    public function get_user_array()
    {
        $api_data = $this->db->exec("SELECT  mid,email,password,firstname,lastname,updated,images,position_name,role_name
         FROM member_tbl,position_tbl,role_tbl
         WHERE member_tbl.position = position_tbl.pid AND member_tbl.role = role_tbl.rid
          ORDER BY updated DESC");
        
        return $api_data;
    }

     //อัพเดรทข้อมูลสมาชิก
     public function update(){
        $post_data = file_get_contents('php://input');
        if($post_data != ''){
            $post_data_array = json_decode($post_data, true);
            $email = $post_data_array['email'];
            $id = $post_data_array['id'];
            $password = $post_data_array['password'];
            $firstname = $post_data_array['firstname'];
            $lastname = $post_data_array['lastname'];
            $position = $this->position($post_data_array['position']);
            $role = $this->role($post_data_array['role']);
            $updated = date("Y-m-d H:i:s");
            $images = $post_data_array['image'];
            $new_email_Data = $this->db->exec("SELECT * FROM member_tbl WHERE email = :email", array(
                ':email' => $email
            ));
            $email_Data = $this->db->exec("SELECT * FROM member_tbl WHERE mid = :id", array(
                ':id' => $id
            ));
            if((count($new_email_Data) > 0 )&& ($new_email_Data != $email_Data)){
                header('Content-Type: application/json');
                echo json_encode('email error');
            }else{
               if($password == ''){
               
                $result = $this->db->exec("UPDATE `member_tbl` SET email=:email,firstname=:firstname ,lastname=:lastname
                ,position=:position, role=:role, updated=:updated,images=:images WHERE mid = :id"
                , array(
                    ':email' => $email,
                    ':id' => $id,
                    ':firstname' => $firstname,
                    ':lastname' => $lastname,
                    ':position' => $position,
                    ':role' => $role,
                    ':updated' => $updated,
                    ':images'=>$images
                ));
                header('Content-Type: application/json');
                echo json_encode($result);
               }else{
                $result = $this->db->exec("UPDATE `member_tbl` SET email=:email,password=:password,firstname=:firstname ,lastname=:lastname
                ,position=:position,role=:role,updated=:updated,images=:images WHERE mid = :id"
                , array(
                    ':email' => $email,
                    ':password' => $password,
                    ':id' => $id,
                    ':firstname' => $firstname,
                    ':lastname' => $lastname,
                    ':position' => $position,
                    ':role' => $role,
                    ':updated' => $updated,   
                    ':images'=>$images
                ));
                header('Content-Type: application/json');
                echo json_encode($result);
               }
            }
        }
    }

    //ลงชื่อเข้าใช้
    public function login($f3){
        $post_data = file_get_contents("php://input");
        if($post_data != '') {
            $post_data_array = json_decode($post_data, true);
            $email = $post_data_array['email'];
            $password = $post_data_array['password'];
            
            // $result = $this->db->exec("INSERT INTO `user`(firstName) VALUES(:name)", array(
            //     ':name' => $name
            // ));
            // if ($result) {
            //     echo $post_data;
            // }
            $api_data = $this->db->exec("SELECT * FROM member_tbl WHERE email = :email AND password = :password ", array(
                ':email' => $email,
                ':password' => $password
            ));
         
            if(count($api_data) > 0) {
           // $f3->set('CACHE','memcache=localhost:3333');
             //   new Session();
                $f3->set('SESSION.email',$email);
                $set_role = $api_data[0]['role'];
                $f3->set('SESSION.role',$set_role);
                // $login_email = $f3->get('SESSION.email');
                // $login_role = $f3->get('SESSION.role');
                header('Content-Type: application/json');
               echo json_encode($api_data);
            } else {
                header('Content-Type: application/json');
                echo json_encode('wrong user or password');
            }       
        }
    }

    //เปลี่ยนค่าการเลือก
    public function position($position){
        if($position == 'Frontend Developer'){
            return 1;
        }else if($position == 'Backend Developer'){
            return 2;
        }else if($position == 'Graphic Design'){
            return 3;
        }else{
            return 4;
        }
    }

    //เปลี่ยนค่าการเลือก
    public function role($role){
         if($role == "admin"){
            return 1;
        }else if($role == "employee"){
            return 2;
        }else{
            return 3;
        }
    }

    //เพิ่มข้อมูลสมัครสมาชิก
    public function register(){
        $post_data = file_get_contents("php://input");
        if($post_data != '') {
            $post_data_array = json_decode($post_data, true);
            $email = $post_data_array['email'];
            $password = $post_data_array['password'];
            $firstname = $post_data_array['firstname'];
            $lastname = $post_data_array['lastname'];
            $images = $post_data_array['image'];
            if($post_data_array['position'] && $post_data_array['role']){
                $position = $this->position($post_data_array['position']);
                $role = $this->role($post_data_array['role']);
            }else{
                $position = 1;
                $role = 3;
            }
            $created = date("Y-m-d H:i:s");
            $updated = date("Y-m-d H:i:s");
            $api_data = $this->db->exec("SELECT * FROM member_tbl WHERE email = :email", array(
                ':email' => $email
            ));
            if(count($api_data) > 0) {
                header('Content-Type: application/json');
                echo json_encode('email error');
            } else {
                $result = $this->db->exec("INSERT INTO `member_tbl`(email,password,firstname,lastname,position,role,created,updated,images) VALUES(:email,:password,:firstname,:lastname,:position,:role,:created,:updated,:images)"
                , array(
                    ':email' => $email,
                    ':password' => $password,
                    ':firstname' => $firstname,
                    ':lastname' => $lastname,
                    ':position' => $position,
                    ':role' => $role,
                    ':created' => $created,
                    ':updated' => $updated, 
                    ':images'=>$images  
                ));
                if ($result) {
                    header('Content-Type: application/json');
                    echo json_encode($post_data);
                }else{
                    header('Content-Type: application/json');
                    echo json_encode('insert error');
                }
            }     
            
        }
    }

    

    //ลบข้อมูล
    public function delete(){
        $post_data = file_get_contents("php://input");
        if($post_data != ''){
            $post_data_array = json_decode($post_data,true);
            $id = $post_data_array['id'];
            $delete_data = $this->db->exec("DELETE FROM member_tbl WHERE mid = :id",array(
                ':id' => $id
            ));
            header('Content-Type: application/json');
            echo json_encode($delete_data);
        }
    }
  }