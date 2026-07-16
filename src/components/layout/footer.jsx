export function Footer() {
  return (
    <footer class="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-0 px-6 md:px-12 lg:px-20 py-7 border-t border-border">
      <span class="text-[12px] text-zinc-500">
        <span class="text-green">›</span> © {new Date().getFullYear()} Mihail Antonov
      </span>
      <span class="text-[12px] text-zinc-500">built with preact<span class="text-green">_</span></span>
    </footer>
  )
}
