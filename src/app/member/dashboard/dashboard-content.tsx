"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { pnd } from "@prisma/client";
import GeneratePdf from "@/shared/generate-pdf";
import { AiFillFilePdf } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { logout } from "./action";
import ConfirmModal from "@/shared/confirm-modal";
import Select from "react-tailwindcss-select";

export default function DashboardData(userData: {
  mType: number;
  mcode: string;
}) {
  const [data, setData] = useState<pnd[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [mcode, setMcode] = useState(userData.mcode);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [year, setYear] = useState(null);
  const [actionPdf, setActionPdf] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/member/api/dashboard`,
        {
          params: { page: page, limit: limit, mcode: mcode },
        }
      )
      .then((response) => {
        setData(response.data.pnd);
        setPageCount(response.data.pageCount);
        setCount(response.data.count);
        setSelectedItems([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page, limit, mcode]);

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

  const handleLogout = async () => {
    await logout();
    return false;
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
        GeneratePdf(item, userData.mType, "Download");
      }
    }

    setSelectedItems([]);
  };

  const handleExportPdfYear = async () => {
    const response = await axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVICE_URL}:${process.env.NEXT_PUBLIC_SERVICE_PORT}/member/api/dashboard/export-pdf-year`,
        {
          params: { mcode: mcode, year: year },
        }
      )
      .then((res) => {
        return res.data.pnd as pnd[];
      })
      .catch((error) => {
        throw error;
      });

    if (response.length > 0) {
      for (const item of response) {
        GeneratePdf(item, userData.mType, "Download");
      }
    }
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

  let options = [{ value: "", label: "" }];
  let uniqueYears = new Set();

  data?.forEach((item) => {
    const year = item.docno.split("/")[0];

    if (year && year.trim() && !uniqueYears.has(year)) {
      uniqueYears.add(year);
      options.push({ value: year, label: year });
    }
  });

  const handleChange = (value: any) => {
    setYear(value);
  };

  return (
    <div className="p-14 mx-2">
      {/* header */}
      <div className="mb-4 justify-between items-start flex-row flex">
        <p className="md:text-2xl font-bold">รายการข้อมูลกำกับภาษี</p>
        <div onClick={handleLogout} className="flex cursor-pointer gap-2">
          <p className="text-[#D03232] md:text-base">ออกจากระบบ</p>
          <MdLogout className="w-5 h-5 text-[#D03232]" />
        </div>
      </div>

      <div className="flex gap-5 justify-between">
        <div className="flex gap-5 mb-4">
          <div className="flex h-[40px] justify-center items-center">
            <p className="md:text-base">
              เลือกแล้ว {selectedItems.length} รายการ
            </p>
          </div>
          <button
            onClick={() => setOpenConfirmModal(true)}
            className={`md:text-base md:w-[114px] md:h-[40px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
              selectedItems.length === 0 && "invisible"
            }`}
          >
            Export PDF
          </button>
        </div>

        {actionPdf ? (
          <div className="flex gap-5">
            <Select
              value={year}
              onChange={handleChange}
              options={options}
              primaryColor={""}
              isClearable={true}
              placeholder="เลือกปี"
            />
            <button
              onClick={() => handleExportPdfYear()}
              className="flex items-center md:text-base md:w-[184px] md:h-[37px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Export PDF
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActionPdf(true)}
            className="flex items-center md:text-base md:w-[164px] md:h-[37px] px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Export PDF รายปี
          </button>
        )}
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
                  <th className="px-5 py-4 text-left text-sm w-[112px] min-w-[112px]">
                    ภงด.
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[160px] min-w-[160px]">
                    ชื่อ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[160px] min-w-[160px]">
                    ที่อยู่
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[132px] min-w-[132px]">
                    เลขบัตรประชาชน
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[102px] min-w-[102px]">
                    รหัสนักธุรกิจ
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[92px] min-w-[92px]">
                    วันที่จ่าย
                  </th>
                  <th className="px-5 py-4 text-left text-sm w-[91px] min-w-[91px]">
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
                  <th className="px-5 py-4 text-left text-sm w-[55px] min-w-[55px]"></th>
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
                            GeneratePdf(item, userData.mType, "Preview");
                          }}
                        >
                          <AiFillFilePdf className="h-6 w-6 text-[#D03232]" />
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
        {isPageOutOfRange ? (
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
        ) : (
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
        )}
      </div>
      <ConfirmModal
        show={openConfirmModal}
        onHide={() => setOpenConfirmModal(false)}
        style="h-10 w-full rounded-5 bg-blue-600 text-white disabled:opacity-75 xs:w-ct120 md:h-ct50 md:text-base"
        text={`ยืนยันการ Export PDF ${selectedItems.length} รายการ`}
        subText=""
        callback={handleMultiExportPdf}
      />
    </div>
  );
}
