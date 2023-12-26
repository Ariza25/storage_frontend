const Footer = () => {
  return (
    <div className="w-full flex flex-col bg-gray-900 text-white">
      <div className=" flex justify-center mb-3 pt-5 border-t">
        <h1 className="font-semibold text-3xl">OwlStorage</h1>
      </div>
      <div className="flex justify-center mb-5">
        <p>	&copy; 2023. Desenvolvido por <a target="__blank" href="https://matheusariza.com/" className="hover:text-slate-400">Matheus Ariza</a></p>
      </div>
    </div>
  )
}

export default Footer