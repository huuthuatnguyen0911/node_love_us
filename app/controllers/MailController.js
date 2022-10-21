const nodemailer = require("nodemailer");
const userModel = require("../models/User");

class MailController {
  // [POST] /mail/send-authentication-account
  sendMailAuthenticationAccount(idUser, status) {
    let content = "";

    return new Promise((resolve, reject) => {
      userModel.findOne({ _id: idUser }).then((user) => {
        if (status) {
          content += `
                    <div class="container">
                    <p class="title_mail" style="font-weight: bold; font-size: 18px">
                      Chúc mừng bạn
                      <span class="name_user" style="font-style: italic"
                        >${user.name}</span
                      >
                    </p>
                    
                    <p class="content">
                      Tài khỏa của bạn đã được xác thực. Giờ đây bạn đã có thể dùng các tính
                      năng giới hạn của chúng tôi.
                    </p>
                    </div>
                    `;
        } else {
          content += `
                    <div class="container">
                    <p class="title_mail" style="font-weight: bold; font-size: 18px">
                    Xin chào bạn
                      <span class="name_user" style="font-style: italic"
                        >${user.name}</span
                      >
                    </p>
                    
                    <p class="content">
                      Tài khỏa của bạn chưa được xác thực. Bạn hãy quay lại xác thự sau nhé.
                    </p>
                    </div>
                    `;
        }

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "thanhthien07062002@gmail.com",
            pass: "rnuyphtrkcikwlgl",
          },
        });

        let mainOptions = {
          // thiết lập đối tượng, nội dung gửi mail
          from: "NQH-Test nodemailer",
          to: user.email,
          subject: "KẾT QUẢ XÁC THỰC TÀI KHOẢN",
          html: content, //Nội dung html mình đã tạo trên kia :))
        };

        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
    });
  }
}

module.exports = new MailController();
