var userApp = angular.module('userApp', []);

userApp.controller('UserController', function UserController($scope, $http, $location) {

  $scope.member = {};
  const url = new URL($location.absUrl());
  $scope.login = url;
  if ($scope.login.pathname == '/fatfree-master/') {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
            fill: false,
            label: 'Manager',
            data: [12],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
          },
          {
            fill: false,
            label: 'Frontend Developer',
            data: [10],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
          },
          {
            fill: false,
            label: 'Backend Developer',
            data: [9, ],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
          },
          {
            fill: false,
            label: 'Graphic Design',
            data: [5],
            backgroundColor: [
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
          },
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "white",
              fontSize: 18,
              beginAtZero: true
            }
          }]
        },
        legend: {
          labels: {
            fontColor: "white",
            fontSize: 18
          },
          position: "bottom",
        }
      }
    });
  }

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
  $scope.loader = false;
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
    $('.btn').attr('disabled', true);
    $scope.loader = true;
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
          $scope.loader = false;
          $scope.success = false;
          $('.alert').alert('close');
          window.location.href = "/fatfree-master/"
        }, 2000)
      } else {
        $('.btn').attr('disabled', false);
        $scope.loader = false;
        $scope.alerterror = "แจ้งเตือน!!! อีเมลล์หรือรหัสผ่านไม่ถูกต้อง"
        $scope.error = true;
        setTimeout(() => {

          $scope.error = false
          $('.alert').alert('close')
        }, 3000)
      }
    }).catch(function (err) {
      $('.btn').attr('disabled', false);
      $scope.loader = false;
      window.alert(err)
    })
  }

  //ออกจากระบบ
  $scope.onLogout = function () {
    localStorage.removeItem('user');
    window.location.href = "/fatfree-master/logout"
  }

  if ($scope.login.pathname == '/fatfree-master/login') {
    localStorage.removeItem('user');
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
    $scope.loader = true;
    $http.get(`/fatfree-master/getUpdate/${$scope.member.update}`).then(function (result) {
      $scope.loader = false;
      $scope.newData = result.data.data[0];
      $scope.member.email = $scope.newData.email;
      $scope.member.firstname = $scope.newData.firstname;
      $scope.member.lastname = $scope.newData.lastname;
      $scope.member.position = $scope.newData.position_name;
      $scope.member.role = $scope.newData.role_name;
      $scope.member.fileUpload = $scope.newData.images || '/fatfree-master/ui/images/member.png';

    }).catch(function (err) {
      $scope.loader = false;
      window.alert(err);
    })
  } else {
    $scope.member.fileUpload = '/fatfree-master/ui/images/member.png';
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
    $scope.loader = true;
    var parameter = JSON.stringify({
      id: id
    });
    $http.post('/fatfree-master/delete', parameter)
      .then(function (result) {
        $scope.loader = false;
        window.location.href = "/fatfree-master/userref"
      }).catch(function (err) {
        $scope.loader = false;
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
      $(document).ready(function () {
        $('#member').DataTable();
      });

    });
  } else {
    //แสดงสมาชิก
    $http.get('/fatfree-master/members').
    then(function (response) {
      $(document).ready(function () {
        $('#member').DataTable({
          "order": [
            [6, "desc"]
          ],
          "language": {
            "sEmptyTable": "ไม่มีข้อมูลในตาราง",
            "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
            "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
            "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
            "sInfoPostFix": "",
            "sInfoThousands": ",",
            "sLengthMenu": "แสดง _MENU_ แถว",
            "sLoadingRecords": "กำลังโหลดข้อมูล...",
            "sProcessing": "กำลังดำเนินการ...",
            "sSearch": "ค้นหา: ",
            "sZeroRecords": "ไม่พบข้อมูล",
            "oPaginate": {
              "sFirst": "หน้าแรก",
              "sPrevious": "ก่อนหน้า",
              "sNext": "ถัดไป",
              "sLast": "หน้าสุดท้าย"
            },
            "oAria": {
              "sSortAscending": ": เปิดใช้งานการเรียงข้อมูลจากน้อยไปมาก",
              "sSortDescending": ": เปิดใช้งานการเรียงข้อมูลจากมากไปน้อย"
            }
          }
        });
      });
      $scope.list = response.data.data;
    });
  }



  //เพิ่มสมาชิก

  $scope.uploadFile = function (event) {
    var files = event.target.files;
    if (files.length == 0) {
      $scope.member.fileUpload = '';
      return $('#preview').attr('src', '/fatfree-master/ui/images/member.png');
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.addEventListener('load', () => {
      $scope.member.fileUpload = reader.result;

      $('#preview').attr('src', $scope.member.fileUpload);
    })
  };

  $scope.submitAddmember = function () {
    //ถ้าเป็นการอัพเดรทข้อมูล
    if ($scope.newData) {
      $scope.loader = true;
      var parameter = JSON.stringify({
        email: $scope.member.email,
        password: $scope.member.password,
        firstname: $scope.member.firstname,
        lastname: $scope.member.lastname,
        position: $scope.member.position,
        role: $scope.member.role,
        id: $scope.member.update,
        image: $scope.member.fileUpload
      });
      $http.post('/fatfree-master/update', parameter).then(function (response) {
        if (response.data == 'update error') {
          $scope.error = true;
          $scope.loader = false;
          setTimeout(() => {

            $scope.error = false
            $('.alert').alert('close')
          }, 3000)
        } else if (response.data == 'email error') {
          $scope.alerterror = "แจ้งเตือน!!! อีเมลล์นี้ถูกใช้งานแล้ว"
          $scope.error = true;
          $scope.loader = false;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)
        } else {
          console.log(response.data)
          $scope.success = true;
          setTimeout(() => {
            $scope.loader = false;
            $scope.success = false
            $('.alert').alert('close')
            window.location.href = "/fatfree-master/userref"
          }, 2000)
        }
      }).catch(e => {
        $scope.loader = false;
        console.log(e);
      })
    } //ถ้าเป็นการเพิ่มข้อมูล
    else {
      $scope.loader = true;
      console.log($scope.member.fileUpload);
      var parameter = JSON.stringify({
        email: $scope.member.email,
        password: $scope.member.password,
        firstname: $scope.member.firstname,
        lastname: $scope.member.lastname,
        position: $scope.member.position,
        role: $scope.member.role,
        image: $scope.member.fileUpload
      });
      $http.post('/fatfree-master/register', parameter).then(function (response) {
        if (response.data == 'insert error') {
          $scope.error = true;
          $scope.loader = false;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)

        } else if (response.data == 'email error') {
          $scope.alerterror = "แจ้งเตือน!!! อีเมลล์นี้ถูกใช้งานแล้ว"
          $scope.error = true;
          $scope.loader = false;
          setTimeout(() => {
            $scope.error = false
            $('.alert').alert('close')
          }, 3000)
        } else {
          $scope.success = true;
          setTimeout(() => {
            $scope.loader = false;
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
userApp.directive('customOnChange', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});