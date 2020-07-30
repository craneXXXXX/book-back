import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Table, Input, Button, Popconfirm, Form, Modal, message } from "antd";
import orderAxios from "../../model/order";
Date.prototype.format = function (str) {
  let year = this.getFullYear();
  let month = this.getMonth() + 1;
  let day = this.getDate();
  let hour = this.getHours();
  let minutes = this.getMinutes();
  let seconds = this.getSeconds();
  str = str
    .replace("yyyy", year)
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hour)
    .replace("mm", minutes)
    .replace("ss", minutes);
  return str;
};
const EditableContext = React.createContext();
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
export default class HomeOrderList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "订单编号",
        dataIndex: "orderid",
        width: "6%",
      },
      {
        title: "商品编号",
        dataIndex: "goodsid",
        width: "6%",
      },
      {
        title: "用户编号",
        dataIndex: "userid",
        width: "6%",
      },
      {
        title: "商品名称",
        dataIndex: "goodsname",
        width: "18%",
      },
      {
        title: "商品图片",
        dataIndex: "goodsimg",
        width: "14%",
      },
      {
        title: "商品价格",
        dataIndex: "goodsprice",
      },
      {
        title: "购买数量",
        dataIndex: "buynum",
      },
      {
        title: "支付时间",
        dataIndex: "paytimes",
      },
      {
        title: "发货信息",
        dataIndex: "orderaddress",
      },
      {
        title: "状态",
        dataIndex: "orderstate",
      },
      {
        title: "操作",
        dataIndex: "operation",
        textAlign: "center",
        render: (text, record) => {
          return record.type == 1 ? (
            <Button
              onClick={() => {
                let source = this.state.dataSource.map((item) => {
                  if (item.orderid == record.orderid) {
                    item.type = 2;
                  }
                  return item;
                });
                this.setState({
                  dataSource: source,
                });
                let deliverytimes = new Date().format("yyyy-MM-dd HH:mm:ss");
                orderAxios
                  .updateordertype(record.orderid, 2, deliverytimes)
                  .then((res) => {
                    if (res.data.code === 1) {
                      message.success(res.data.msg);
                    } else {
                      message.warning(res.data.msg);
                    }
                  });
              }}
            >
              发货
            </Button>
          ) : record.type == 0 ? (
            <Button disabled>待支付</Button>
          ) : record.type == 3 ? (
            <Button disabled>订单完成</Button>
          ) : (
            <Button disabled>已发货</Button>
          );
        },
      },
    ];
    this.state = {
      dataSource: [],
      count: 0,
    };
    orderAxios.searchorderlist().then((res) => {
      console.log(res.data);
      let dataSource = [];
      res.data.forEach((item, index) => {
        dataSource[index] = {};
        dataSource[index].key = index;
        dataSource[index].orderid = item.id;
        dataSource[index].goodsid = item.goodsid;
        dataSource[index].userid = item.userid;
        dataSource[index].goodsname = item.goodsname;
        dataSource[index].goodsprice = item.goodsprice;
        dataSource[index].goodsimg = (
          <img src={item.goodsimg} alt="goodslist" width="200" />
        );
        dataSource[index].buynum = item.buynum;
        dataSource[index].paytimes = item.paytimes;
        dataSource[index].type = item.type;
        dataSource[index].orderaddress = item.orderaddress;
        if (item.type == 0) {
          dataSource[index].orderstate = "等待支付";
        } else if (item.type == 1) {
          dataSource[index].orderstate = "支付完成，去发货";
        } else if (item.type == 2) {
          dataSource[index].orderstate = "等待确认收货";
        } else if (item.type == 3) {
          dataSource[index].orderstate = "订单完成";
        }
      });
      this.setState({
        dataSource: dataSource,
        count: dataSource.length,
      });
    });
  }
  componentWillUnmount() {}
  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}
