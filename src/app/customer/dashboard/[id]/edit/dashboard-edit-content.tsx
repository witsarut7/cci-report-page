"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { pnd } from "@prisma/client";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function DashboardEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [datepaid, setDatepaid] = useState<any>({
    startDate: null,
    endDate: null,
  });

  const schema = Yup.object().shape({
    id: Yup.number(),
    docno: Yup.string().required("กรุณากรอก ภงด."),
    name: Yup.string().required("กรุณากรอก ชื่อ - นามสกุล"),
    address: Yup.string().required("กรุณากรอก ที่อยู่"),
    idcardno: Yup.string()
      .matches(/^\d{1,13}$/, "เลขบัตรประชาชนต้องไม่เกิน 13 หลักเท่านั้น")
      .required(),
    datepaid: Yup.string().required("กรุณากรอก วันที่จ่าย"),
    incometype: Yup.string().required("กรุณากรอก ประเภทรายได้"),
    percentage: Yup.number().typeError("กรุณากรอก อัตราร้อยละ").required(),
    income: Yup.string()
      .required("กรุณากรอก จำนวนเงินได้")
      .test(
        "is-decimal-2",
        "จำนวนเงินต้องมีจุดทศนิยมไม่เกิน 2 ตำแหน่ง",
        (value) => {
          return /^\d+(\.\d{1,2})?$/.test(value.replace(/,/g, ""));
        }
      ),
    wht: Yup.string()
      .required("กรุณากรอก ภาษีหัก ณ ที่จ่าย")
      .test(
        "is-decimal-2",
        "จำนวนเงินต้องมีจุดทศนิยมไม่เกิน 2 ตำแหน่ง",
        (value) => {
          return /^\d+(\.\d{1,2})?$/.test(value.replace(/,/g, ""));
        }
      ),
    mcode: Yup.string().required("กรุณากรอก รหัสนักธุรกิจ"),
    date_added: Yup.date(),
    date_modify: Yup.date(),
  });

  type FormData = Yup.InferType<typeof schema>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/dashboard/${params.id}`
      )
      .then((response) => {
        const pndData = response.data.pnd as pnd;

        const income = Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(Number(pndData.income));

        const wht = Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(Number(pndData.wht));

        setValue("id", pndData.id);
        setValue("docno", pndData.docno);
        setValue("name", pndData.name);
        setValue("address", pndData.address);
        setValue("idcardno", pndData.idcardno);
        setValue("datepaid", pndData.datepaid);
        setValue("incometype", pndData.incometype);
        setValue("percentage", pndData.percentage);
        setValue("income", income);
        setValue("wht", wht);
        setValue("date_added", pndData.date_added);
        setValue("date_modify", pndData.date_modify);
        setValue("mcode", pndData.mcode);

        setDatepaid({
          startDate: moment(pndData.datepaid, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          ),
          endDate: moment(pndData.datepaid, "DD/MM/YYYY").format("YYYY-MM-DD"),
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [setValue, params]);

  const decimalNumber = async (value: string) => {
    const numberWithCommasRemoved: string = value.replace(/,/g, "");
    const decimalNumber: number = parseFloat(numberWithCommasRemoved);
    return decimalNumber;
  };

  const onSubmit = async (data: FormData) => {
    const income = await decimalNumber(data.income);
    const wht = await decimalNumber(data.wht);

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/dashboard/${params.id}`,
      {
        docno: data.docno,
        name: data.name,
        address: data.address,
        idcardno: data.idcardno,
        datepaid: moment(datepaid.startDate, "YYYY-MM-DD").format("DD/MM/YYYY"),
        incometype: data.incometype,
        percentage: Number(data.percentage),
        income: income,
        wht: wht,
        mcode: data.mcode,
      }
    );

    if (response.status === 200) {
      router.replace("/customer/dashboard", { scroll: true });
    }
  };

  return (
    <div className="p-14 mx-2">
      {/* header */}
      <div className="mb-8 justify-start items-start flex-row flex">
        <p className="md:text-2xl font-bold">แก้ไขข้อมูล</p>
      </div>

      {/* body */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 grid md:grid-rows-2 gap-5">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            <div>
              <p className="xl:text-base mb-2">
                ภงด. <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.docno && errors.docno.message}
                className={
                  errors.docno
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("docno")}
              />
            </div>
            <div>
              <p className="xl:text-base mb-2">
                ชื่อ - นามสกุล <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.name && errors.name.message}
                className={
                  errors.name
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("name")}
              />
            </div>
            <div>
              <p className="xl:text-base mb-2">
                เลขบัตรประชาชน <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.idcardno && errors.idcardno.message}
                className={
                  errors.idcardno
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("idcardno")}
              />
            </div>
            <div className="relative">
              <p className="xl:text-base mb-2">
                วันที่จ่าย <span className="text-red-500">*</span>
              </p>
              <Datepicker
                inputClassName={
                  errors.datepaid
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 ps-10 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 ps-10 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                toggleClassName="absolute text-[#000000] ps-3 inset-y-0 start-0 focus:outline-none"
                i18n={"th"}
                placeholder={errors.datepaid && errors.datepaid.message}
                primaryColor={"blue"}
                value={datepaid}
                onChange={(value: any) => {
                  setDatepaid(value);
                  setValue("datepaid", value.startDate);
                }}
                displayFormat={"DD/MM/YYYY"}
                startWeekOn="mon"
                useRange={false}
                asSingle={true}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            <div>
              <p className="xl:text-base mb-2">
                ประเภทรายได้ <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.incometype && errors.incometype.message}
                className={
                  errors.incometype
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("incometype")}
              />
            </div>
            <div>
              <p className="xl:text-base mb-2">
                อัตราร้อยละ <span className="text-red-500">*</span>
              </p>
              <input
                type="number"
                placeholder={errors.percentage && errors.percentage.message}
                className={
                  errors.percentage
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("percentage")}
              />
            </div>
            <div>
              <p className="xl:text-base mb-2">
                จำนวนเงินได้ <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.income && errors.income.message}
                className={
                  errors.income
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("income")}
              />
            </div>
            <div>
              <p className="xl:text-base mb-2">
                ภาษีหัก ณ ที่จ่าย <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.wht && errors.wht.message}
                className={
                  errors.wht
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("wht")}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 grid md:grid-rows-1 gap-5">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            <div>
              <p className="xl:text-base mb-2">
                รหัสนักธุรกิจ <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder={errors.mcode && errors.mcode.message}
                className={
                  errors.mcode
                    ? "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                    : "w-full xl:w-11/12 md:h-[40px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                }
                {...register("mcode")}
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-5">
              <div>
                <p className="xl:text-base mb-2">
                  ที่อยู่ <span className="text-red-500">*</span>
                </p>
                <textarea
                  placeholder={errors.address && errors.address.message}
                  className={
                    errors.address
                      ? "w-full xl:w-full md:h-[150px] block p-4 text-sm text-gray-700 bg-white border-2 border-red-600 rounded-md focus:outline-none focus:ring-red-600"
                      : "w-full xl:w-full md:h-[150px] block p-4 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  }
                  {...register("address")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mb-4 justify-end items-start flex-row flex">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={() => {
                router.replace("/customer/dashboard", { scroll: true });
              }}
              className="md:text-base md:w-[69px] md:h-[40px] p-2 tracking-wide text-black transition-colors duration-200 transform bg-[#FFFFFF] rounded-md hover:bg-[#C0C0C0] focus:outline-nonefocus:bg-[#C0C0C0] border"
            >
              ยกเลิก
            </button>
            <button className="md:text-base md:w-[69px] md:h-[40px] p-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
