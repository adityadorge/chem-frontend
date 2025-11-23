<script>
  const cards = [
    {
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
      tag: "Technology",
      tagColor: "bg-blue-200 text-blue-700",
      title: "What's New In 2022 Tech",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea atque quidem!",
      author: "Jane Doe",
      time: "2h ago",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      tag: "Food",
      tagColor: "bg-yellow-200 text-yellow-700",
      title: "Delicious Food",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea atque quidem!",
      author: "Jony Doe",
      time: "Yesterday",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      tag: "Automobile",
      tagColor: "bg-red-200 text-red-700",
      title: "Race To Your Heart Content",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea atque quidem!",
      author: "John Doe",
      time: "2d ago",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg"
    }
  ];
</script>

<div class="flex flex-wrap gap-8 justify-center items-center py-8">
  {#each cards as card}
    <div class="lg:w-[28rem] w-96 sm:w-80 xs:w-full rounded-2xl shadow-lg bg-white overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-xl max-w-full">
      <img src={card.image} alt={card.title} class="lg:h-72 h-56 sm:h-48 xs:h-40 w-full object-cover"/>
      <div class="lg:p-10 p-7 sm:p-5 xs:p-4 flex-1 flex flex-col">
        <span class={`lg:px-6 px-4 py-1 rounded-full text-sm font-semibold mb-4 self-start ${card.tagColor}`}>{card.tag}</span>
        <h2 class="font-bold lg:text-2xl text-xl sm:text-lg xs:text-base mb-3">{card.title}</h2>
        <p class="text-gray-600 lg:text-lg text-base sm:text-sm xs:text-xs mb-8">{card.desc}</p>
      </div>
    </div>
  {/each}
</div>