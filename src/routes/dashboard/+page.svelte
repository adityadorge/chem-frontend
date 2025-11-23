<script>
  // Static UI only – no interactivity
</script>

<div class="min-h-screen bg-slate-50 p-4 md:p-6">
  <!-- Page heading -->
  <div class="mb-6">
    <h3 class="text-2xl font-semibold text-slate-800">Profile Statistics</h3>
  </div>

  <div class="grid grid-cols-12 gap-6">
    <!-- Left: main content -->
    <div class="col-span-12 lg:col-span-9 space-y-6">
      <!-- Stat cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div class="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <!-- eye -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
              </svg>
            </div>
            <div>
              <p class="text-slate-500 text-sm">Profile Views</p>
              <p class="text-slate-800 font-extrabold text-lg">112.000</p>
            </div>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div class="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
              <!-- user -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"/>
              </svg>
            </div>
            <div>
              <p class="text-slate-500 text-sm">Followers</p>
              <p class="text-slate-800 font-extrabold text-lg">183.000</p>
            </div>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div class="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <!-- add user -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-2 2c-4.2 0-7 2.2-7 4.5V21h8.5a6.5 6.5 0 0 1-.9-7z"/>
                <path d="M19 13v-2h-2v2h-2v2h2v2h2v-2h2v-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-slate-500 text-sm">Following</p>
              <p class="text-slate-800 font-extrabold text-lg">80.000</p>
            </div>
          </div>
        </div>
        <!-- Card 4 -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div class="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
              <!-- bookmark -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-slate-500 text-sm">Saved Post</p>
              <p class="text-slate-800 font-extrabold text-lg">112</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Visit (Bar chart placeholder) -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-5 py-4 border-b border-slate-100">
          <h4 class="text-slate-800 font-semibold">Profile Visit</h4>
        </div>
        <div class="p-5">
          <!-- static bars -->
          <div class="h-64 w-full grid grid-cols-12 items-end gap-3">
            <div class="h-10 bg-indigo-600/90 rounded"></div>
            <div class="h-20 bg-indigo-600/90 rounded"></div>
            <div class="h-32 bg-indigo-600/90 rounded"></div>
            <div class="h-20 bg-indigo-600/90 rounded"></div>
            <div class="h-10 bg-indigo-600/90 rounded"></div>
            <div class="h-32 bg-indigo-600/90 rounded"></div>
            <div class="h-32 bg-indigo-600/90 rounded"></div>
            <div class="h-20 bg-indigo-600/90 rounded"></div>
            <div class="h-10 bg-indigo-600/90 rounded"></div>
            <div class="h-20 bg-indigo-600/90 rounded"></div>
            <div class="h-32 bg-indigo-600/90 rounded"></div>
            <div class="h-20 bg-indigo-600/90 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Bottom row: left mini charts + right latest comments -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Mini charts stack -->
        <div class="col-span-12 xl:col-span-4 space-y-6">
          <!-- Card: Profile Visit regions -->
          <div class="bg-white rounded-xl shadow-sm">
            <div class="px-5 py-4 border-b border-slate-100">
              <h4 class="text-slate-800 font-semibold">Profile Visit</h4>
            </div>
            <div class="p-5 space-y-6">
              <!-- item -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
                    <h5 class="text-slate-800 font-medium">Europe</h5>
                  </div>
                  <div class="text-slate-800 font-semibold">862</div>
                </div>
                <div class="h-14 w-full rounded bg-slate-100"></div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
                    <h5 class="text-slate-800 font-medium">America</h5>
                  </div>
                  <div class="text-slate-800 font-semibold">375</div>
                </div>
                <div class="h-14 w-full rounded bg-slate-100"></div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
                    <h5 class="text-slate-800 font-medium">India</h5>
                  </div>
                  <div class="text-slate-800 font-semibold">625</div>
                </div>
                <div class="h-14 w-full rounded bg-slate-100"></div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
                    <h5 class="text-slate-800 font-medium">Indonesia</h5>
                  </div>
                  <div class="text-slate-800 font-semibold">1025</div>
                </div>
                <div class="h-14 w-full rounded bg-slate-100"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Latest Comments -->
        <div class="col-span-12 xl:col-span-8">
          <div class="bg-white rounded-xl shadow-sm">
            <div class="px-5 py-4 border-b border-slate-100">
              <h4 class="text-slate-800 font-semibold">Latest Comments</h4>
            </div>
            <div class="p-5 overflow-x-auto">
              <table class="min-w-full text-left">
                <thead>
                  <tr class="text-sm text-slate-500">
                    <th class="py-3 pr-6 font-medium">Name</th>
                    <th class="py-3 font-medium">Comment</th>
                  </tr>
                </thead>
                <tbody class="text-slate-700">
                  <!-- Row -->
                  <tr class="align-top border-t">
                    <td class="py-4 pr-6">
                      <div class="flex items-center">
                        <span class="inline-flex h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 items-center justify-center font-semibold">SC</span>
                        <span class="ml-3 font-semibold">Si Cantik</span>
                      </div>
                    </td>
                    <td class="py-4">Congratulations on your graduation!</td>
                  </tr>
                  <tr class="align-top border-t">
                    <td class="py-4 pr-6">
                      <div class="flex items-center">
                        <span class="inline-flex h-10 w-10 rounded-full bg-violet-100 text-violet-700 items-center justify-center font-semibold">SG</span>
                        <span class="ml-3 font-semibold">Si Ganteng</span>
                      </div>
                    </td>
                    <td class="py-4">Wow amazing design! Can you make another tutorial for this design?</td>
                  </tr>
                  <tr class="align-top border-t">
                    <td class="py-4 pr-6">
                      <div class="flex items-center">
                        <span class="inline-flex h-10 w-10 rounded-full bg-amber-100 text-amber-700 items-center justify-center font-semibold">SE</span>
                        <span class="ml-3 font-semibold">Singh Eknoor</span>
                      </div>
                    </td>
                    <td class="py-4">What a stunning design! You are so talented and creative!</td>
                  </tr>
                  <tr class="align-top border-t">
                    <td class="py-4 pr-6">
                      <div class="flex items-center">
                        <span class="inline-flex h-10 w-10 rounded-full bg-rose-100 text-rose-700 items-center justify-center font-semibold">RJ</span>
                        <span class="ml-3 font-semibold">Rani Jhadav</span>
                      </div>
                    </td>
                    <td class="py-4">I love your design! It’s so beautiful and unique! How did you learn to do this?</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: sidebar cards -->
    <div class="col-span-12 lg:col-span-3 space-y-6">
      <!-- Profile card -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-4">
          <span class="h-14 w-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-semibold">JD</span>
          <div>
            <h5 class="text-slate-800 font-semibold">John Duck</h5>
            <p class="text-slate-500 text-sm">@johnducky</p>
          </div>
        </div>
      </div>

      <!-- Recent Messages -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-5 py-4 border-b border-slate-100">
          <h4 class="text-slate-800 font-semibold">Recent Messages</h4>
        </div>
        <div class="p-5 space-y-4">
          <div class="flex items-center gap-3">
            <span class="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">HS</span>
            <div>
              <p class="font-semibold text-slate-800">Hank Schrader</p>
              <p class="text-slate-500 text-sm">@johnducky</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="h-12 w-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold">DW</span>
            <div>
              <p class="font-semibold text-slate-800">Dean Winchester</p>
              <p class="text-slate-500 text-sm">@imdean</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">JD</span>
            <div>
              <p class="font-semibold text-slate-800">John Dodol</p>
              <p class="text-slate-500 text-sm">@dodoljohn</p>
            </div>
          </div>
          <button class="w-full mt-2 btn btn-outline-primary px-4 py-2 rounded-lg border border-sky-600 text-sky-700 hover:bg-sky-50">
            Start Conversation
          </button>
        </div>
      </div>

      <!-- Visitors Profile (donut placeholder) -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-5 py-4 border-b border-slate-100">
          <h4 class="text-slate-800 font-semibold">Visitors Profile</h4>
        </div>
        <div class="p-6">
          <!-- static donut using conic-gradient -->
          <div class="mx-auto relative h-56 w-56 rounded-full"
               style="background: conic-gradient(#1d4ed8 0 30%, #10b981 30% 60%, #f59e0b 60% 85%, #ef4444 85% 100%)">
            <div class="absolute inset-6 bg-white rounded-full"></div>
          </div>
          <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-blue-600"></span> <span>30.0%</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> <span>30.0%</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span> <span>25.0%</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span> <span>15.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>