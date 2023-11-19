import { useNavigate } from "react-router-dom";
import ArrowLeft from "@/assets/icons/arrow-left";

const FormHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-16 px-8 gap-3 items-center border-b-[1px]">
      <div className="cursor-pointer" onClick={handleGoBack}>
        <ArrowLeft className="w-4 h-4 text-[#293066]" />
      </div>
      <h3 className="text-lg font-bold text-[#293066]">{title}</h3>
    </div>
  );
};

export default FormHeader;