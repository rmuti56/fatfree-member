var userApp = angular.module('userApp', []);

userApp.controller('UserController', function UserController($scope, $http, $location) {
  $scope.member = {};
  const url = new URL($location.absUrl());

  $scope.member.search = url.searchParams.get('search');
  $scope.member.key = url.searchParams.get('key');
  $scope.member.update = url.searchParams.get('id');
  //สร้างตัวเลือก
  $scope.position = [
    'Frontend Developer',
    'Backend Developer',
    'Graphic Design',
    'Manager'
  ]
  $scope.role = [
    'admin',
    'employee',
    'member'
  ]
  $scope.search = [
    'รหัส',
    'ชื่อ',
    'นามสกุล',
    'อีเมลล์',
    'ตำแหน่ง',
    'สิทธิ์'
  ]
  $scope.userLogin = JSON.parse(localStorage.getItem('user'));
  $scope.linkUrl = window.location.pathname;
  if ($scope.userLogin && $scope.linkUrl == '/fatfree-master/login') {
    window.location.href = "/fatfree-master/";
  }
  $scope.error = false;
  $scope.success = false;
  $scope.alertsuccess = "แจ้งเตือน!!! ดำเนินการเรียบร้อย";
  $scope.alerterror = "แจ้งเตือน!!! เกิดข้อผิดพลาด";
  //เข้าสู่ระบบ

  $scope.submitLogin = function () {
    var parameter = JSON.stringify({
      type: "member",
      email: $scope.member.email,
      password: $scope.member.password
    });
    $http.post('/fatfree-master/login', parameter).then(function (response) {

      if (response.data != 'wrong user or password') {
        $scope.newItem = JSON.stringify({
          'email': response.data[0].email,
          'role': response.data[0].role
        })
        localStorage.setItem(
          'user', $scope.newItem
        );
        $scope.alertsuccess = "แจ้งเตือน!!! เข้าสู่ระบบสำเร็จ"
        $scope.success = true;
        setTimeout(() => {
          $scope.success = false;
          $('.alert').alert('close');
          window.location.href = "/fatfree-master/"
        }, 2000)
      } else {
        $scope.alerterror = "แจ้งเตือน!!! อีเมลล์หรือรหัสผ่านไม่ถูกต้อง"
        $scope.error = true;
        setTimeout(() => {
          $scope.error = false
          $('.alert').alert('close')
        }, 3000)
      }
    }).catch(function (err) {
      window.alert(err)
    })
  }

  //ออกจากระบบ
  $scope.onLogout = function () {
    localStorage.removeItem('user');

    window.location.href = "/fatfree-master/logout"
  }
  //สมัครสมาชิก
  $scope.submitRegister = function () {
    var parameter = JSON.stringify({
      email: $scope.member.email,
      password: $scope.member.password,
      firstname: $scope.member.firstname,
      lastname: $scope.member.lastname
    });
    $http.post('/fatfree-master/register', parameter).then(function (response) {
      if (response.data == 'insert error') {
        $scope.error = true;
        setTimeout(() => {
          $scope.error = false
          $('.alert').alert('close')
        }, 3000)

      } else if (response.data == 'email error') {
        $scope.alerterror = "แจ้งเตือน!!! อีเมลล์นี้ถูกใช้งานแล้ว"
        $scope.error = true;
        setTimeout(() => {
          $scope.error = false
          $('.alert').alert('close')
        }, 3000)
      } else {
        $scope.success = true;
        setTimeout(() => {
          $scope.success = false
          $('.alert').alert('close')
          window.location.href = "/fatfree-master/login";
        }, 2000)

      }
    }).catch(function (err) {
      window.alert(err)
    })
  }

  //นำข้อมูลมาแสดงเพื่อแก้ไข
  if ($scope.member.update) {
    $http.get(`/fatfree-master/getUpdate/${$scope.member.update}`).then(function (result) {

      $scope.newData = result.data.data[0];
      $scope.member.email = $scope.newData.email;
      $scope.member.firstname = $scope.newData.firstname;
      $scope.member.lastname = $scope.newData.lastname;
      $scope.member.position = $scope.newData.position_name;
      $scope.member.role = $scope.newData.role_name;
      console.log($scope.newData)
    }).catch(function (err) {
      window.alert(err);
    })
  }

  //ไปยังหน้าแก้ไขสมาชิก
  $scope.onUpdate = function (id) {
    window.location.href = `/fatfree-master/addmember?id=${id}`;
  }

  $scope.model = function (firstname, mid) {
    $scope.firstnameDel = firstname;
    $scope.idDel = mid;
  }

  //ลบสมาชิก
  $scope.onDelete = function (id) {
    var parameter = JSON.stringify({
      id: id
    });
    $http.post('/fatfree-master/delete', parameter)
      .then(function (result) {
        window.location.href = "/fatfree-master/userref"
      }).catch(function (err) {
        window.alert(err);
      })
  }


  $scope.listSearch = {};


  //ค้นหาสมาชิก
  $scope.onSubmitSearch = function () {
    if (!$scope.member.search || !$scope.member.key) {
      return
    }
    window.location.href = `/fatfree-master/userref?search=${$scope.member.search}&key=${$scope.member.key}`
  }

  if ($scope.member.search && $scope.member.key) {
    $http.get(`/fatfree-master/members?search=${$scope.member.search}&key=${$scope.member.key}`).then(function (response) {
      $scope.list = response.data.data;
    });
  } else {
    //แสดงสมาชิก
    $http.get('/fatfree-master/members').
    then(function (response) {
      $scope.list = response.data.data;
    });
  }


  //เพิ่มสมาชิก
  $scope.submitAddmember = function () {
    //ถ้าเป็นการอัพเดรทข้อมูล
    if ($scope.newData) {
      var parameter = JSON.stringify({
        email: $scope.member.email,
        password: $scope.member.password,
        firstname: $scope.member.firstname,
        lastname: $scope.member.lastname,
        position: $scope.member.position,
        role: $scope.member.role,
        id: $scope.member.update
      });
      $http.post('/fatfree-master/update', parameter).then(function (response) {
        if (response.data == 'update error') {
          $scope.error = true;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)
        } else if (response.data == 'email error') {
          $scope.alerterror = "แจ้งเตือน!!! อีเมลล์นี้ถูกใช้งานแล้ว"
          $scope.error = true;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)
        } else {
          console.log(response.data)
          $scope.success = true;
          setTimeout(() => {
            $scope.success = false
            $('.alert').alert('close')
            window.location.href = "/fatfree-master/userref"
          }, 2000)
        }
      }).catch(e => {
        console.log(e);
      })
    } //ถ้าเป็นการเพิ่มข้อมูล
    else {
      var parameter = JSON.stringify({
        email: $scope.member.email,
        password: $scope.member.password,
        firstname: $scope.member.firstname,
        lastname: $scope.member.lastname,
        position: $scope.member.position,
        role: $scope.member.role
      });
      $http.post('/fatfree-master/register', parameter).then(function (response) {
        if (response.data == 'insert error') {
          $scope.error = true;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)

        } else if (response.data == 'email error') {
          $scope.alerterror = "แจ้งเตือน!!! อีเมลล์นี้ถูกใช้งานแล้ว"
          $scope.error = true;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)
        } else {
          $scope.success = true;
          setTimeout(() => {
            $scope.success = false
            $('.alert').alert('close')
            window.location.href = "/fatfree-master/userref";
          }, 2000)

        }
      }).catch(function (err) {
        window.alert(err)
      })
    }
  }

}).directive('passwordVerify', passwordVerify);

function passwordVerify() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, elem, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function () {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('passwordVerify', function (val) {
        validate();
      });

      var validate = function () {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.passwordVerify;
        // set validity
        ngModel.$setValidity('passwordVerify', val1 === val2);
      };
    }
  }
}