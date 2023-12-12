import { cn } from "@/utils";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { id as Id } from "date-fns/locale";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FileInput from "@/components/input-file";
import ProfileIcon from "@/assets/icons/profile";
import { NumericFormat } from "react-number-format";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import toIsoDate from "@/utils/formatter/convertToIso";
import MultipleSelect from "@/components/multiple-select";
import {
  editVolunterSchema,
  volunterSchema,
} from "@/utils/api/volunter/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getVolunteerVacancyById,
  addVolunteerVacancy,
  editVolunteerVacancy,
  updateStatusVolunteerVacancy,
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "@/utils/api/volunter/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponseDialogue from "./response-dialogue";

const VolunterForm = ({ action, id }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState("");
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [{ provinces, regencies, districts, villages }, setData] = useState({
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
  });
  const [{ province, regency, district }, setSelectedData] = useState({
    province: { id: "", name: "" },
    regency: { id: "", name: "" },
    district: { id: "", name: "" },
    village: { id: "", name: "" },
  });

  const form = useForm({
    resolver: zodResolver(
      action === "edit" ? editVolunterSchema : volunterSchema
    ),
    defaultValues: {
      title: "",
      description: "",
      skills_required: [],
      number_of_vacancies: "",
      contact_email: "",
      application_deadline: "",
      province: "",
      city: "",
      sub_district: "",
      detail_location: "",
    },
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const getDetailVolunteerVacancy = async (id) => {
    try {
      const {
        title,
        description,
        skills_required,
        number_of_vacancies,
        contact_email,
        application_deadline,
        province,
        city,
        sub_disctrict,
        detail_location,
        status,
        photo,
      } = await getVolunteerVacancyById(id);

      const formattedEndDate = new Date(application_deadline);
      const formatedSkills = skills_required.map((skill) => ({
        value: skill,
        label: skill,
      }));

      setStatus(status);
      setPreview(photo);

      form.reset({
        title,
        description,
        skills_required: formatedSkills,
        number_of_vacancies,
        contact_email,
        application_deadline: formattedEndDate,
        province,
        city,
        sub_disctrict,
        detail_location,
        photo,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (action !== "add") {
      getDetailVolunteerVacancy(id);
    }
  }, [action, id]);

  const onSubmit = (data) => {
    const {
      title,
      description,
      skills_required,
      number_of_vacancies,
      contact_email,
      application_deadline,
      province,
      city,
      sub_district,
      detail_location,
      photo,
    } = data;

    const endDate = toIsoDate(application_deadline);
    const formattedSkills = skills_required.map((skill) => skill.value);

    if (action === "add") {
      addVolunteerVacancy({
        title,
        description,
        skills_required: formattedSkills,
        number_of_vacancies,
        contact_email,
        application_deadline: endDate,
        province,
        city,
        sub_district,
        detail_location,
        photo,
      })
        .then((message) => Toast.fire({ icon: "success", title: message }))
        .catch((message) => Toast.fire({ icon: "error", title: message }))
        .finally(navigate("/lowongan-relawan"));
    } else if (action === "edit") {
      const editedData = {
        title,
        description,
        skills_required,
        number_of_vacancies,
        application_deadline: endDate,
        province,
        city,
        sub_district,
        detail_location,
        ...(photo instanceof File && { photo }),
      };

      editVolunteerVacancy(id, editedData)
        .then((message) => Toast.fire({ icon: "success", title: message }))
        .catch((message) => Toast.fire({ icon: "error", title: message }))
        .finally(navigate("/lowongan-relawan"));
    }
  };

  const updateVolunteer = (id, status) => {
    setProcessing(true);
    updateStatusVolunteerVacancy(id, status)
      .then((message) => {
        navigate("/lowongan-relawan");
        Toast.fire({ icon: "success", title: message });
      })
      .catch((message) => {
        navigate("/lowongan-relawan");
        Toast.fire({ icon: "error", title: message });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const updateVolunter = (id, status) => {
    updateStatusVolunteerVacancy(id, status)
      .then((message) => {
        Toast.fire({ icon: "success", title: message });
      })
      .catch((message) => Toast.fire({ icon: "error", title: message }))
      .finally(navigate("lowongan-relawan"));
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (province.id === "") {
          const provincesData = await getProvinces();
          setData((prevState) => ({ ...prevState, provinces: provincesData }));
        }

        if (province.id !== "" && regency.id === "") {
          const regenciesData = await getRegencies(province.id);
          setData((prevState) => ({ ...prevState, regencies: regenciesData }));
        }

        if (regency.id !== "" && district.id === "") {
          const districtsData = await getDistricts(regency.id);
          setData((prevState) => ({ ...prevState, districts: districtsData }));
        }

        if (district.id !== "") {
          const villagesData = await getVillages(district.id);
          setData((prevState) => ({ ...prevState, villages: villagesData }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [province.id, regency.id, district.id]);

  return (
    <Form {...form}>
      <form
        className="px-6 py-6 mb-6 flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="input-volunter-title">
                  Judul Lowongan Relawan
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="input-volunter-title"
                    className="disabled:opacity-100"
                    disabled={action === "detail"}
                    placeholder="Masukkan judul lowongan relawan"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number_of_vacancies"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="input-volunter-number">
                  Jumlah Lowongan
                </FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    customInput={Input}
                    allowNegative={false}
                    id="input-volunter-number"
                    disabled={action === "detail"}
                    className="disabled:opacity-100"
                    placeholder="Masukkan Jumlah Lowongan"
                    onValueChange={(v) => {
                      field.onChange(Number(v.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="input-volunter-description">
                Isi Deskripsi
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id="input-volunter-description"
                  className="min-h-[100px] disabled:opacity-100"
                  disabled={action === "detail"}
                  placeholder="Masukkan deskripsi lowongan relawan"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills_required"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Keahlian yang dibutuhkan</FormLabel>
              <FormControl>
                <MultipleSelect
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={action === "detail"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="application_deadline"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="input-volunter-application-deadline">
                  Tanggal Selesai Lowongan Relawan
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={action === "detail"}
                        id="input-volunter-application-deadline"
                        className={cn(
                          "pl-3 text-left font-normal w-full disabled:opacity-100 disabled:cursor-not-allowed",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? (
                          format(field.value, "PPP", { locale: Id })
                        ) : (
                          <span>Pilih tanggal mulai lowongan relawan</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => isFutureDate(date)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {action !== "edit" && (
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="input-volunter-email">
                    Kontak Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="input-volunter-email"
                      className="disabled:opacity-100"
                      disabled={action === "detail"}
                      placeholder="Masukkan kontak email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex gap-4">
          <FormField
            name="province"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="input-volunter-provinces">
                  Provinsi
                </FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={action === "detail"}
                  onValueChange={(e) => {
                    const data = JSON.parse(e);

                    field.onChange(data.name);
                    setSelectedData((prevState) => ({
                      ...prevState,
                      province: { id: data.id, name: data.name },
                    }));
                  }}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Provinsi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {provinces.map((province) => (
                        <SelectItem
                          key={province.id}
                          value={JSON.stringify(province)}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Kabupaten</FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={action === "detail"}
                  onValueChange={(e) => {
                    const data = JSON.parse(e);

                    field.onChange(data.name);
                    setSelectedData((prevState) => ({
                      ...prevState,
                      regency: { id: data.id, name: data.name },
                    }));
                  }}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kabupaten" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {regencies.map((regency) => (
                        <SelectItem
                          key={regency.id}
                          value={JSON.stringify(regency)}>
                          {regency.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="sub_district"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Kecamatan</FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={action === "detail"}
                  onValueChange={(e) => {
                    const data = JSON.parse(e);

                    field.onChange(data.name);
                    setSelectedData((prevState) => ({
                      ...prevState,
                      district: { id: data.id, name: data.name },
                    }));
                  }}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kecamatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem
                        key={district.id}
                        value={JSON.stringify(district)}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="detail_location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Kelurahan</FormLabel>
                <Select
                  defaultValue={field.value}
                  disabled={action === "detail"}
                  onValueChange={(e) => {
                    const data = JSON.parse(e);

                    field.onChange(data.name);
                    (prevState) => ({
                      ...prevState,
                      village: { id: data.id, name: data.name },
                    });
                  }}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kelurahan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {villages.map((village) => (
                      <SelectItem
                        key={village.id}
                        value={JSON.stringify(village)}>
                        {village.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="input-volunter-image">Foto</FormLabel>
              <FormControl>
                <FileInput
                  preview={preview}
                  id="input-volunter-image"
                  placeholder="Tambahkan foto Lowongan Relawan di sini"
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);

                    if (action !== "detail") {
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {action === "detail" && (
          <div
            style={{ display: action !== "detail" ? "none" : "" }}
            className=" pt-[18px] py-5">
            <Label>Pendaftar Lowongan</Label>
            <div
              className="w-full rounded-md border p-3 flex flex-row items-center gap-1 cursor-pointer"
              onClick={() => navigate(`/list-pendaftar-lowongan-relawan`)}>
              <ProfileIcon className="w-2 h-2" />
              <ProfileIcon className="w-2 h-2 ml-3" />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-5">
          <Button
            size="sm"
            type="button"
            id="btn-action-negative"
            disabled={
              (action === "detail" && status !== "pending") || processing
            }
            onClick={() => {
              if (action !== "detail") {
                navigate("/lowongan-relawan");
              } else {
                setOpen(true);
              }
            }}
            className="bg-white w-24 text-[#293066] border-solid border-2 border-[#293066] hover:bg-[#293066] hover:text-white">
            {action === "editing"
              ? "Batal"
              : action === "detail"
              ? "Tolak"
              : "kembali"}
          </Button>
          <Button
            size="sm"
            disabled={action === "detail" && status !== "pending"}
            type={action === "detail" ? "button" : "submit"}
            className="bg-[#293066] w-24 hover:bg-[#293066]/80"
            id="btn-action-positive"
            onClick={
              action === "detail"
                ? () => updateVolunteer(id, "accepted")
                : undefined
            }>
            {action === "edit"
              ? "Edit data"
              : action === "detail"
              ? "Terima"
              : action === "add"
              ? "Tambah"
              : ""}
          </Button>
        </div>
      </form>
      <ResponseDialogue
        open={open}
        onOpenChange={setOpen}
        status={status}
        id={id}
      />
    </Form>
  );
};
export default VolunterForm;
