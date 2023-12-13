import { ButtonClick } from "@/components/button";
import { LayoutLogin } from "@/components/card-login";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosWithConfig from "@/utils/api/axiosWithConfig";

function OTPPage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOTP = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleNextClick = async () => {
    try {
      const response = await axiosWithConfig.post("/users/verify-otp", {
        otp: otp.join(""),
      });
      navigate("/repassword");
    } catch (error) {
      // Handle error jika terjadi kesalahan pada permintaan ke server
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again later.");
    }
  };

  const calculateTimeLeft = () => {
    const start = Moment().valueOf();
    const end = Moment(time).valueOf();
    var diffTime = end - start;
    var formated1 = Moment(diffTime).format("mm:ss");
    if (timeLeft === "00:00") {
      setShow(true);
    } else {
      return formated1;
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    let timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <LayoutLogin
      label="Raih Peduli - Lupa Password"
      route="/lupa-password"
      id="raih-peduli-tittle"
    >
      <p className="opacity-70 my-[2.5rem]">
        Kode verifikasi OTP telah dikirim ke email kamu.
      </p>
      <div className="row">
        <div className="col text-center">
          {otp.map((data, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              aria-label={`otp-input-${index}`}
              className="bg-[#E5E9F4] border-1 rounded-lg w-[3rem] h-[3rem] text-center mx-[0.625rem] mb-5 font-bold text-xl"
              type="text"
              name="otp"
              maxLength="1"
              autoComplete="off" // Tambahkan autoComplete
              value={data}
              onChange={(e) => handleOTP(e.target, index)}
              onFocus={(e) => e.target.select()}
              autoFocus={index === 0} // Tambahkan autoFocus pada input pertama
            />
          ))}
          <p className="opacity-70">OTP Entered - {otp.join("")}</p>
          <ButtonClick
            label="Selanjutnya"
            aria-label="btn-next-otp"
            id="btn-next-otp"
            className="w-full h-[3.25rem] bg-[#293066] hover:bg-[#293066] text-white mt-[2rem]"
            onClick={handleNextClick}
          />
        </div>
      </div>
    </LayoutLogin>
  );
}

export default OTPPage;
