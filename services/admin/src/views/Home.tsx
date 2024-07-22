import useMe from "@admin/hook/useMe";
import { Button } from "@ui/component/Button";
import { IArrowForward, IBell, IClock, IDoneCircle, IInfo, ITruck } from "@ui/component/Icons";
import { Spinner } from "@ui/component/Spinner";
import { Tag } from "@ui/component/Tag";
import { Tooltip } from "@ui/component/Tooltip";
import cx from "clsx";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";

const stats = { A: 2, B: 2, C: 10, D: 1 };

const Home = () => {
  const me = useMe();

  if (!me || !stats) return <Spinner centered={true} />;

  return (
    <main className="flex items-center justify-center">
      <div className="container flex max-w-max flex-col">
        <h1 className="my-6">Overview</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <Stat color="blue" title={"Active shipments"} value={stats.A} Icon={ITruck} targetName={"Shipments"} targetURL={"/shipments?status=transiting"} />
          <Stat
            color="red"
            title={"Delayed shipments"}
            value={stats.B}
            Icon={IClock}
            targetName={"Shipments"}
            targetURL={"/shipments?delayed=yes"}
            description='Count of shipments which generated a "delayed" alert in the last 30d.'
          />
          {me.role === "ADMIN" && (
            <Stat
              color="red"
              title={"Active tracker alerts"}
              value={stats.C}
              Icon={IBell}
              targetName={"Shipments"}
              targetURL={"/alerts?archived=no"}
              description="Count of alerts emitted by the tracker provider, but not read yet."
            />
          )}
          <Stat
            color="green"
            title={"Delivered shipments"}
            value={stats.D}
            Icon={IDoneCircle}
            targetName={"Shipments"}
            targetURL={"/shipments?status=delivered"}
            description="Count of shipments delivered in the last 30d."
          />
        </div>
      </div>
    </main>
  );
};

export default Home;

type StatProps = {
  title: string;
  value: number;
  description?: string;
  targetName: string;
  targetURL: string;
  Icon: IconType;
  color: string;
};

const Stat: React.FC<StatProps> = ({ title, description, value, targetName, targetURL, Icon, color }) => {
  return (
    <div className={"flex min-w-[389px] flex-col items-start gap-4 rounded-xl bg-white p-6"}>
      <Tag className={cx(color, "!border-0")}>{<Icon size={24} />}</Tag>
      <h3 className={cx(color, "flex items-center justify-center gap-2")}>
        <span>{title}</span>
        {description && (
          <Tooltip text={description}>
            <IInfo size={16} />
          </Tooltip>
        )}
      </h3>
      <span className="kpi-value mt-[-5px] font-bold">{value}</span>
      <Link to={targetURL}>
        <Button className="blue-outlined uppercase" RightIcon={IArrowForward}>
          {targetName}
        </Button>
      </Link>
    </div>
  );
};
