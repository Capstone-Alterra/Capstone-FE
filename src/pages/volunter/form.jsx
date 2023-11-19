import Header from "@/components/header";
import Layout from "@/components/layout";
import React, { useState } from "react";
import backIcon from "@/assets/icons/back-icon.svg";
import { useNavigate } from "react-router-dom";
import { InputLabel } from "@/components/input-with-label";
import { TextAreaLabel } from "@/components/textarea-with-label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import InputFile from "@/components/input-file";

function VolunterForm() {
  const navigate = useNavigate();
  const [tags, setTags] = useState(["Pendidikan", "Komunikasi", "Teknologi"]);
  const [date, setDate] = useState(undefined);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTags = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      setTags([...tags, e.target.value]);
      e.target.value = "";
    }
  };

  return (
    <Layout>
      <Header titleHeader="Lowongan Relawan" />
      <div className="rounded shadow my-5">
        <div className="rounded-t border-y-2">
          <p
            className="p-3 font-bold flex flex-row items-center cursor-pointer"
            onClick={handleBack}>
            <img
              src={backIcon}
              alt="Back Icon"
              className="mr-2"
              id="btn-back"
            />
            Tambah Lowongan Relawan
          </p>
        </div>
        <div>
          <div className="px-6 pt-[18px]">
            <InputLabel
              label="Judul Volunter Vacancies"
              type="text"
              id="judul-volunter"
              placeholder="Relawan Pengajar - Program Pendidikan Anak"
            />
          </div>
          <div className="px-6">
            <TextAreaLabel
              label="Isi Deskripsi"
              name="deskripsi"
              id="deskripsi-volunter"
              placeholder="Membantu dalam mengajar dan membimbing anak-anak untuk meningkatkan pendidikan mereka."
            />
          </div>
          <div className="px-6 ">
            <p className="font-semibold mb-2">Keahlian</p>
            <div className="w-full h-wrap border p-3 rounded-md">
              <ul className="flex flex-row justify-center items-center">
                {tags.map((tag, index) => (
                  <li key={index} className="mr-2">
                    <Badge className="bg-[#293066] hover:bg-[#293066]/80">
                      {tag}
                      <a
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 cursor-pointer text-base">
                        x
                      </a>
                    </Badge>
                  </li>
                ))}
                <Input
                  className="border-none"
                  placeholder="Ketik dan Enter untuk menambah"
                  onKeyUp={(e) => (e.key === "Enter" ? addTags(e) : null)}
                />
              </ul>
            </div>
          </div>
          <div className="flex flex-row gap-5 px-6 mt-4">
            <div className="w-full">
              <InputLabel
                label="Number of Vacancies"
                type="number"
                id="slot-volunter"
                placeholder="50"
              />
            </div>
            <div className="w-full">
              <InputLabel
                label="Contact Email"
                type="email"
                id="contact-email-volunter"
                placeholder="jenny@gmail.com"
              />
            </div>
          </div>
          <div className="flex flex-row gap-5 px-6">
            <div className="w-full">
              <Label htmlFor="calendar1">Tanggal Mulai Penggalangan Dana</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="calendar1"
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}>
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full">
              <Label htmlFor="calendar2">
                Tanggal Selesai Penggalangan Dana
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="calendar2"
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}>
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="px-6 pt-[18px]">
            <Label htmlFor="form-image">Gambar Penggalangan Dana</Label>
            <InputFile
              word="Tambahkan Foto Penggalangan dana di sini"
              name="image"
              id="form-image"
            />
          </div>
          <div className="flex flex-row gap-5 justify-end px-6 py-3">
            <Button
              className="bg-white-500 text-[#293066] border-solid border-2 border-[#293066] hover:bg-[#293066] hover:text-white"
              id="btn-cancel">
              Batal
            </Button>
            <Button
              className="bg-[#293066] text-white hover:bg-[#293066]"
              id="btn-simpan">
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VolunterForm;
