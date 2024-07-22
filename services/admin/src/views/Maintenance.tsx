const Maintenance = () => {
  return (
    <main className="flex items-center justify-center">
      <div className="bg-blue-light absolute inset-0 -z-30 flex flex-col items-center justify-center gap-8">
        <img src="/maintenance.svg" alt="Under maintenance." />
        <h1 className="blue">Sorry, we are down for maintenance.</h1>
        <p>We’ll be back shortly.</p>
      </div>
    </main>
  );
};

export default Maintenance;
