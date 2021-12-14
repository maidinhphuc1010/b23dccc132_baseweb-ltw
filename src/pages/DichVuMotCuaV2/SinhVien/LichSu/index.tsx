/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import ThanhToan from '@/components/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { TrangThaiDonDVMC } from '@/utils/constants';
import type { IColumn } from '@/utils/interfaces';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormQuyTrinh from '../../components/FormQuyTrinh';

const LichSuGuiDon = () => {
  const {
    page,
    limit,
    condition,
    getDonSinhVienModel,
    loading,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    setDanhSach,
    setLoaiDichVu,
    setRecord,
  } = useModel('dichvumotcuav2');
  const [recordView, setRecordView] = useState<DichVuMotCuaV2.Don>();
  const [type, setType] = useState<string>('view');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  useEffect(() => {
    setRecord({} as DichVuMotCuaV2.BieuMau);
    setLoaiDichVu(arrPathName?.includes('dvmc') ? 'DVMC' : 'VAN_PHONG_SO');
    return () => {
      setDanhSach([]);
    };
  }, []);
  const columns: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 200,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['thongTinDichVu', 'ten'],
      align: 'left',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 150,
      search: 'filterString',
      notRegex: true,
      render: (val) => <div>{TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 150,
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record: DichVuMotCuaV2.Don) => {
        return (
          <>
            <Tooltip title="Chi tiết">
              <Button
                type="primary"
                onClick={() => {
                  setRecordView(record);
                  setVisibleFormBieuMau(true);
                  setType('view');
                }}
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <TableBase
        dataState="danhSachDon"
        widthDrawer="60%"
        title="Lịch sử gửi đơn"
        modelName="dichvumotcuav2"
        columns={columns}
        loading={loading}
        dependencies={[page, limit, condition]}
        getData={getDonSinhVienModel}
      />

      <Modal
        destroyOnClose
        width="850px"
        footer={false}
        visible={visibleFormBieuMau}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisibleFormBieuMau(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh
              type="view"
              idDon={recordView?._id}
              record={recordView?.thongTinDichVu?.quyTrinh}
              thoiGianTaoDon={recordView?.createdAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <Form
              hideCamKet
              infoNguoiTaoDon={recordView?.thongTinNguoiTao}
              type={type}
              record={recordView}
            />
          </Tabs.TabPane>
          {recordView?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan record={recordView} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
    </>
  );
};

export default LichSuGuiDon;
