﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace User.Application.Contracts.Persistence
{
    public interface IRoleRepository : IAsyncRepository<User.Domain.Entities.User>
    {
    }
}