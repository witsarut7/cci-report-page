"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ali_member, pnd } from "@prisma/client";
import { AiFillFilePdf, AiOutlineEdit } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { logout } from "./action";
import Datepicker from "react-tailwindcss-datepicker";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeneratePdf from "@/shared/generate-pdf";
import ConfirmModal from "@/shared/confirm-modal";

export default function DashboardData() {
  const router = useRouter();
  const [data, setData] = useState<pnd[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState<string>();
  const [dateRange, setDateRange] = useState<any>({
    startDate: null,
    endDate: null,
  });
  const [file, setFile] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [jsonResult, setJsonResult] = useState<Array<JsonObject>>([]);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [exportPdfConfirmModal, setExportPdfConfirmModal] = useState(false);

  interface JsonObject {
    [key: string]: string;
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/dashboard`,
        {
          params: {
            page: page,
            limit: limit,
            startDate: dateRange?.startDate,
            endDate: dateRange?.endDate,
            search: search,
          },
        }
      )
      .then((response) => {
        setData(response.data.pnd);
        setPageCount(response.data.pageCount);
        setCount(response.data.count);
        setSelectedItems([]);
        setJsonResult([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page, limit, dateRange, search]);

  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > pageCount;

  const pageNumbers = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= pageCount) {
      pageNumbers.push(i);
    }
  }

  const fetchData = async () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/dashboard`,
        {
          params: {
            page: page,
            limit: limit,
            startDate: dateRange?.startDate,
            endDate: dateRange?.endDate,
            search: search,
          },
        }
      )
      .then((res) => {
        setData(res.data.pnd);
        setPageCount(res.data.pageCount);
        setCount(res.data.count);
        setSelectedItems([]);
        setJsonResult([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleLogout = async () => {
    await logout();
    return false;
  };

  const handleCheckboxChange = (id: number) => {
    const selectedIndex = selectedItems.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, id]);
    } else {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(selectedIndex, 1);
      setSelectedItems(newSelectedItems);
    }
  };

  const handleMultiCheckboxChange = (data: pnd[]) => {
    const ids = data.map((item) => item.id);
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(ids);
    }
  };

  const handleMultiDelete = async () => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/dashboard`,
      {
        data: selectedItems,
      }
    );

    if (response.status === 200) {
      toast.success(`ลบข้อมูล ${selectedItems.length} รายการ`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });

      // fetching data after delete
      await fetchData();
    }
  };

  const handleMultiCreate = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/dashboard/import-excel`,
      { jsonResult }
    );

    if (response.data.status === 200) {
      toast.success("บันทึกข้อมูลสำเร็จ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });

      // fetching data after create
      await fetchData();
    } else if (response.data.status === 404) {
      toast.error("กรอกข้อมูลไม่ครบ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return undefined;
    } else if (file) {
      const regex = /\.xlsx$/i;
      const checkFileType = regex.test(file.name);

      if (!checkFileType) {
        return toast.error("รูปแบบไฟล์ไม่ถูกต้อง", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });
      }

      setFile(file);

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          const bstr = e.target.result;
          const workBook = XLSX.read(bstr, { type: "binary" });
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
          const fileData: Array<Array<string>> = XLSX.utils.sheet_to_json(
            workSheet,
            { header: 1 }
          );

          const headers: Array<string> = fileData[1];
          fileData.splice(0, 2);

          // remove empty values
          const filteredData = fileData.filter((item) => item.length > 0);

          const jsonArray: Array<JsonObject> = filteredData.map((row) => {
            const jsonObject: JsonObject = {};
            headers.forEach((header, index) => {
              jsonObject[header] = row[index];
            });
            return jsonObject;
          });
          setJsonResult(jsonArray);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportPdf = async (data: pnd, mcode: string) => {
    const response = await axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/member`,
        {
          params: { mcode: mcode },
        }
      )
      .then((res) => {
        return res.data.member as ali_member;
      })
      .catch((error) => {
        throw error;
      });

    if (response) {
      GeneratePdf(data, response.mtype, "Preview");
    } else {
      return toast.error(`รหัสนักธุรกิจ ${mcode} ไม่ถูกต้อง`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
    }
  };

  const handleMultiExportPdf = async () => {
    const response = await axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/member/api/dashboard/export-pdf`,
        {
          params: { ids: selectedItems.join(",") },
        }
      )
      .then((res) => {
        return res.data.pnd as pnd[];
      })
      .catch((error) => {
        throw error;
      });

    if (response) {
      for (const item of response) {
        const findMember = await axios
          .get(
            `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/customer/api/member`,
            {
              params: { mcode: item.mcode },
            }
          )
          .then((res) => {
            return res.data.member as ali_member;
          })
          .catch((error) => {
            throw error;
          });

        if (findMember) {
          GeneratePdf(item, findMember.mtype, "Download");
        } else {
          return toast.error(`รหัสนักธุรกิจ ${item.mcode} ไม่ถูกต้อง`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Flip,
          });
        }
      }
    }

    setSelectedItems([]);
  };

  return (
    <div className="p-14 mx-2">
      <ToastContainer stacked />

      {/* header */}
      <div className="mb-4 justify-between items-start flex-row flex">
        <p className="md:text-2xl font-bold">Dashboard</p>
        <div onClick={handleLogout} className="flex cursor-pointer gap-2">
          <p className="text-[#D03232] md:text-base">ออกจากระบบ</p>
          <MdLogout className="w-5 h-5 text-[#D03232]" />
        </div>
      </div>

      <div className="mb-4 justify-between items-start flex-row flex">
        <div className="flex gap-5">
          <div className="flex h-[40px] justify-center items-center">
            <p className="md:text-base">
              เลือกแล้ว {selectedItems.length} รายการ
            </p>
          </div>
          <button
            onClick={() => setDeleteConfirmModal(true)}
            className={`text-[#D03232] md:text-base ${
              selectedItems.length === 0 && "invisible"
            }`}
          >
            ลบรายการ
          </button>
          <button
            onClick={() => setExportPdfConfirmModal(true)}
            className={`md:text-base md:w-[125px] md:h-[40px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
              selectedItems.length === 0 && "invisible"
            }`}
          >
            Export PDF
          </button>
        </div>

        <div className="flex gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <AiOutlineSearch className="md:w-6 md:h-6" />
            </div>
            <input
              type="search"
              className="md:w-[288px] md:h-[40px] block p-4 ps-10 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="ค้นหา"
              onChange={(value) => {
                setSearch(value.target.value);
              }}
            />
          </div>

          <div className="relative">
            <Datepicker
              inputClassName="md:w-[288px] md:h-[40px] block p-4 ps-10 text-sm text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              toggleClassName="absolute text-[#000000] ps-3 inset-y-0 start-0 focus:outline-none"
              i18n={"th"}
              placeholder={"เลือกวันที่"}
              primaryColor={"blue"}
              value={dateRange}
              onChange={(value: any) => {
                setDateRange(value);
              }}
              displayFormat={"DD/MM/YYYY"}
              startWeekOn="mon"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              router.push("/customer/dashboard/create");
            }}
            className="md:text-base md:w-[125px] md:h-[40px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            เพิ่มข้อมูล
          </button>

          <div className="block">
            {jsonResult.length === 0 ? (
              <div>
                <label
                  htmlFor="file-upload"
                  className="md:text-base md:w-[125px] md:h-[40px] cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Import Excel
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex gap-5">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="md:text-base w-full cursor-pointer border-b-black border-b-2 hover:text-blue-600 hover:border-b-blue-600"
                  >
                    <span>{file.name}</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setJsonResult([]);
                  }}
                  className="md:text-base md:w-[69px] md:h-[40px] p-2 tracking-wide text-black transition-colors duration-200 transform bg-gray-400 rounded-md hover:bg-[#C0C0C0] focus:outline-nonefocus:bg-[#C0C0C0] border"
                >
                  ยกเลิก
                </button>
                <button
                  className="md:text-base md:w-[69px] md:h-[40px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#15803d] rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                  onClick={handleMultiCreate}
                >
                  ตกลง
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* table */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col bg-white overflow-hidden">
          <div className="overflow-x-auto overflow-hidden">
            <table className="w-full min-w-[1024px] table-fixed divide-y divide-ctLightGray border-b border-b-ctLightGray">
              <thead className="text-base bg-[#CDD8FF]">
                <tr>
                  <th className="px-5 py-4 text-left text-sm w-[16px] min-w-[16px]">
                    <input
                      type="checkbox"
                      onChange={() => handleMultiCheckboxChange(data)}
                      checked={
                        selectedItems.length === data.length &&
                        selectedItems.length !== 0
                      }
                    />
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[90px] min-w-[90px]">
                    ภงด.
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[160px] min-w-[160px]">
                    ชื่อ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[160px] min-w-[160px]">
                    ที่อยู่
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[112px] min-w-[112px]">
                    เลขบัตรประชาชน
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[100px] min-w-[100px]">
                    รหัสนักธุรกิจ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[92px] min-w-[92px]">
                    วันที่จ่าย
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[95px] min-w-[95px]">
                    ประเภทรายได้
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[81px] min-w-[81px]">
                    อัตราร้อยละ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[85px] min-w-[85px]">
                    จำนวนเงินได้
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[100px] min-w-[100px]">
                    ภาษีหัก ณ ที่จ่าย
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[27px] min-w-[27px]"></th>
                  <th className="px-5 py-4 text-left text-sm w-[27px] min-w-[27px]"></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((item: pnd) => (
                    <tr
                      key={item.id}
                      className="bg-white border-b dark:border-[#D9D9D9]"
                    >
                      <td className="px-5 py-4 text-left text-sm">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item.id)}
                          checked={selectedItems.includes(item.id)}
                        />
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.docno ? item.docno : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.name ? item.name : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.address ? item.address : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.idcardno ? item.idcardno : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.mcode ? item.mcode : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.datepaid ? item.datepaid : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.incometype ? item.incometype : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.percentage ? item.percentage : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.income
                          ? Intl.NumberFormat("en-US", {
                              minimumFractionDigits: 2,
                            }).format(Number(item?.income))
                          : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        {item.wht
                          ? Intl.NumberFormat("en-US", {
                              minimumFractionDigits: 2,
                            }).format(Number(item?.wht))
                          : "-"}
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            handleExportPdf(item, item.mcode);
                          }}
                        >
                          <AiFillFilePdf className="h-6 w-6 text-[#D03232]" />
                        </button>
                      </td>
                      <td className="px-5 py-4 text-left text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/customer/dashboard/${item.id}/edit`);
                          }}
                        >
                          <AiOutlineEdit className="md:h-[24px] md:w-[24px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* footer */}
      <div>
        {isPageOutOfRange && (
          <div>
            <div className="flex justify-center items-center mt-8">
              <Image
                width={240}
                height={240}
                src={"/data-not-found.png"}
                alt="Picture of the author"
              />
            </div>

            <div className="flex justify-center items-center">
              <p className="text-center md:text-2xl font-bold mt-8">
                ไม่มีข้อมูลกำกับภาษี
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center border-light-gray p-4 bg-white border-b dark:border-[#D9D9D9] w-full">
          <div className="hidden flex-row items-center gap-x-2 md:flex">
            <p className="text-sm">showing {data.length} to</p>
            <select
              value={limit}
              onChange={(value) => {
                setLimit(Number(value.target.value));
              }}
              className="flex h-[30px] border-0 py-0 focus:ring-0 md:border text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <p className="text-sm">of {count} results</p>
          </div>
          <div className="flex gap-4 cursor-default">
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {page === 1 ? (
                <a
                  className="opacity-60 text-sm cursor-not-allowed relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  aria-disabled="true"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ) : (
                <div
                  aria-label="Previous Page"
                  onClick={() => {
                    setPage(prevPage);
                  }}
                  className="font-semibold text-gray-900 text-sm relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {pageNumbers.map((pageNumber, index) => (
                <div
                  key={index}
                  className={
                    page === pageNumber
                      ? "relative z-10 inline-flex items-center bg-[#002DCD] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002DCD]"
                      : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }
                  onClick={() => {
                    setPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </div>
              ))}
              {page === pageCount ? (
                <a className="opacity-60 text-sm cursor-not-allowed relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ) : (
                <div
                  aria-label="Next Page"
                  onClick={() => {
                    setPage(nextPage);
                  }}
                  className="font-semibold text-gray-900 text-sm relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={deleteConfirmModal || exportPdfConfirmModal}
        onHide={() => {
          setDeleteConfirmModal(false), setExportPdfConfirmModal(false);
        }}
        style={`${
          (deleteConfirmModal && "bg-red-600") ||
          (exportPdfConfirmModal && "bg-blue-600")
        } "h-10 w-full rounded-5 text-white disabled:opacity-75 xs:w-ct120 md:h-ct50 md:text-base"`}
        text={`${
          (deleteConfirmModal &&
            `ยืนยันการลบ ${selectedItems.length} รายการ`) ||
          (exportPdfConfirmModal &&
            `ยืนยันการ Export PDF ${selectedItems.length} รายการ`)
        }`}
        subText=""
        callback={
          (deleteConfirmModal && handleMultiDelete) ||
          (exportPdfConfirmModal && handleMultiExportPdf)
        }
      />
    </div>
  );
}
